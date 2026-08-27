import { createVerify, randomUUID } from 'node:crypto'
import http from 'node:http'

const port = Number(process.env.API_PORT || 8787)
const host = process.env.API_HOST || '0.0.0.0'
const publicBaseUrl = process.env.PUBLIC_APP_URL || 'http://127.0.0.1:5173'
const monobankToken = process.env.MONOBANK_TOKEN
const bookPrice = Number(process.env.BOOK_PRICE_UAH)
const orderEmail = process.env.ORDER_EMAIL || 'book@denkiiashko.com'
const monobankWebhookUrl = process.env.MONOBANK_WEBHOOK_URL
const pendingOrders = new Map()
const processingInvoices = new Set()
const notifiedInvoices = new Set()
let monobankPublicKey

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  response.end(JSON.stringify(payload))
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { reject(new Error('Invalid JSON')) }
    })
    request.on('error', reject)
  })
}

function readRawBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => resolve(body))
    request.on('error', reject)
  })
}

function isValidOrder(order) {
  return ['name', 'surname', 'phone', 'email', 'address'].every((field) => String(order?.[field] || '').trim())
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

async function handleMonobankWebhook(request, response) {
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

  if (notifiedInvoices.has(invoice.invoiceId) || processingInvoices.has(invoice.invoiceId)) {
    sendJson(response, 200, { received: true })
    return
  }

  const order = pendingOrders.get(invoice.invoiceId)
  if (!order) {
    sendJson(response, 500, { message: 'Дані замовлення для invoice не знайдені' })
    return
  }

  processingInvoices.add(invoice.invoiceId)
  try {
    await sendPaidOrderEmail(order, invoice)
    notifiedInvoices.add(invoice.invoiceId)
    pendingOrders.delete(invoice.invoiceId)
    sendJson(response, 200, { received: true })
  } catch (error) {
    sendJson(response, 500, { message: error instanceof Error ? error.message : 'Помилка email' })
  } finally {
    processingInvoices.delete(invoice.invoiceId)
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    })
    response.end()
    return
  }

  if (request.method === 'POST' && request.url === '/api/monobank/webhook') {
    try {
      await handleMonobankWebhook(request, response)
    } catch (error) {
      sendJson(response, 500, { message: error instanceof Error ? error.message : 'Помилка webhook' })
    }
    return
  }

  if (request.method !== 'POST' || request.url !== '/api/create-invoice') {
    sendJson(response, 404, { message: 'Not found' })
    return
  }

  try {
    if (!monobankToken) throw new Error('MONOBANK_TOKEN не налаштований на сервері')
    if (!Number.isFinite(bookPrice) || bookPrice <= 0) throw new Error('BOOK_PRICE_UAH не налаштований на сервері')

    const order = await readBody(request)
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
        basketOrder: [{ name: 'Книга «Як продати майже все»', qty: 1, sum: Math.round(bookPrice * 100), unit: 'шт' }],
      },
      redirectUrl: `${publicBaseUrl}/book?payment=success`,
      ...(monobankWebhookUrl ? { webHookUrl: monobankWebhookUrl } : {}),
    }

    const monoResponse = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: { 'X-Token': monobankToken, 'Content-Type': 'application/json' },
      body: JSON.stringify(invoicePayload),
    })
    const monoData = await monoResponse.json().catch(() => ({}))

    if (!monoResponse.ok) {
      sendJson(response, monoResponse.status, { message: monoData.errorDescription || 'Monobank не створив рахунок' })
      return
    }

    pendingOrders.set(monoData.invoiceId, order)
    sendJson(response, 200, { invoiceId: monoData.invoiceId, pageUrl: monoData.pageUrl })
  } catch (error) {
    sendJson(response, 500, { message: error instanceof Error ? error.message : 'Помилка сервера' })
  }
})

server.listen(port, host, () => {
  console.log(`Payment API listening on http://${host}:${port}`)
})
