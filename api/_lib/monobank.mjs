import { createVerify, randomUUID } from 'node:crypto'
import {
  claimWebhook,
  getPendingOrder,
  markInvoiceNotified,
  releaseWebhookClaim,
  savePendingOrder,
  wasInvoiceNotified,
} from './store.mjs'

const monobankToken = process.env.MONOBANK_TOKEN
const bookPrice = Number(process.env.BOOK_PRICE_UAH)
const orderEmail = process.env.ORDER_EMAIL || 'book@denkiiashko.com'
const publicAppUrl = process.env.PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
const configuredWebhookUrl = process.env.MONOBANK_WEBHOOK_URL
let monobankPublicKey

export function sendJson(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.json(payload)
}

export function handleOptions(request, response) {
  if (request.method !== 'OPTIONS') return false
  sendJson(response, 204, {})
  return true
}

export async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') return request.body

  const rawBody = typeof request.body === 'string'
    ? request.body
    : await readRawBody(request)

  try {
    return JSON.parse(rawBody)
  } catch {
    throw new Error('Invalid JSON')
  }
}

export function readRawBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => resolve(body))
    request.on('error', reject)
  })
}

function isValidOrder(order) {
  return ['name', 'surname', 'phone', 'email', 'address']
    .every((field) => String(order?.[field] || '').trim())
}

async function getMonobankPublicKey() {
  if (monobankPublicKey) return monobankPublicKey
  if (!monobankToken) throw new Error('MONOBANK_TOKEN не налаштований на сервері')

  const response = await fetch('https://api.monobank.ua/api/merchant/pubkey', {
    headers: { 'X-Token': monobankToken },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.key) throw new Error('Не вдалося отримати ключ Monobank')

  monobankPublicKey = Buffer.from(data.key, 'base64').toString('utf8')
  return monobankPublicKey
}

async function isValidWebhookSignature(body, signature) {
  if (!signature) return false

  const verifier = createVerify('SHA256')
  verifier.update(body)
  verifier.end()
  return verifier.verify(await getMonobankPublicKey(), Buffer.from(signature, 'base64'))
}

function formatAmount(amountInKopecks) {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' })
    .format(amountInKopecks / 100)
}

async function sendPaidOrderEmail(order, invoice) {
  const payload = new URLSearchParams({
    name: order.name,
    surname: order.surname,
    phone: order.phone,
    email: order.email,
    address: order.address,
    payment: 'Оплачено',
    amount: formatAmount(invoice.finalAmount ?? invoice.amount),
    invoiceId: invoice.invoiceId,
    comment: order.comment || '',
    _replyto: order.email,
    _subject: 'Оплачене замовлення книги',
    _template: 'table',
  })

  const response = await fetch(`https://formsubmit.co/ajax/${orderEmail}`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: payload,
  })

  if (!response.ok) throw new Error('Не вдалося надіслати підтвердження оплати')
}

export async function createInvoice(request, response) {
  if (handleOptions(request, response)) return

  try {
    if (!monobankToken) throw new Error('MONOBANK_TOKEN не налаштований на сервері')
    if (!Number.isFinite(bookPrice) || bookPrice <= 0) {
      throw new Error('BOOK_PRICE_UAH не налаштований на сервері')
    }
    if (!publicAppUrl) throw new Error('PUBLIC_APP_URL не налаштований на сервері')

    const order = await readJsonBody(request)
    if (!isValidOrder(order)) {
      sendJson(response, 400, { message: 'Заповніть усі обов’язкові поля' })
      return
    }

    const invoicePayload = {
      amount: Math.round(bookPrice * 100),
      ccy: 980,
      merchantPaymInfo: {
        reference: randomUUID(),
        destination: 'Книга «Як продати майже все»',
        comment: `${order.name} ${order.surname}; ${order.phone}; ${order.email}; ${order.address}`,
        basketOrder: [{
          name: 'Книга «Як продати майже все»',
          qty: 1,
          sum: Math.round(bookPrice * 100),
          unit: 'шт',
        }],
      },
      redirectUrl: `${publicAppUrl.replace(/\/$/, '')}/book?payment=success`,
      webHookUrl: configuredWebhookUrl || `${publicAppUrl.replace(/\/$/, '')}/api/monobank/webhook`,
    }

    const monoResponse = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: { 'X-Token': monobankToken, 'Content-Type': 'application/json' },
      body: JSON.stringify(invoicePayload),
    })
    const monoData = await monoResponse.json().catch(() => ({}))

    if (!monoResponse.ok) {
      sendJson(response, monoResponse.status, {
        message: monoData.errorDescription || 'Monobank не створив рахунок',
      })
      return
    }

    await savePendingOrder(monoData.invoiceId, order)
    sendJson(response, 200, {
      invoiceId: monoData.invoiceId,
      pageUrl: monoData.pageUrl,
    })
  } catch (error) {
    sendJson(response, 500, { message: error instanceof Error ? error.message : 'Помилка сервера' })
  }
}

export async function handleWebhook(request, response) {
  if (handleOptions(request, response)) return

  try {
    const rawBody = await readRawBody(request)
    const signature = request.headers['x-sign']

    if (!(await isValidWebhookSignature(rawBody, signature))) {
      sendJson(response, 401, { message: 'Invalid Monobank webhook signature' })
      return
    }

    let invoice
    try {
      invoice = JSON.parse(rawBody)
    } catch {
      sendJson(response, 400, { message: 'Invalid JSON' })
      return
    }

    if (invoice.status !== 'success') {
      sendJson(response, 200, { received: true })
      return
    }

    if (await wasInvoiceNotified(invoice.invoiceId)) {
      sendJson(response, 200, { received: true })
      return
    }

    if (!(await claimWebhook(invoice.invoiceId))) {
      sendJson(response, 200, { received: true })
      return
    }

    const order = await getPendingOrder(invoice.invoiceId)
    if (!order) {
      await releaseWebhookClaim(invoice.invoiceId)
      sendJson(response, 500, { message: 'Дані замовлення для invoice не знайдені' })
      return
    }

    try {
      await sendPaidOrderEmail(order, invoice)
      await markInvoiceNotified(invoice.invoiceId)
      sendJson(response, 200, { received: true })
    } catch (error) {
      await releaseWebhookClaim(invoice.invoiceId)
      sendJson(response, 500, { message: error instanceof Error ? error.message : 'Помилка email' })
    }
  } catch (error) {
    sendJson(response, 500, { message: error instanceof Error ? error.message : 'Помилка webhook' })
  }
}
