const memoryOrders = globalThis.__bookStorePendingOrders ??= new Map()
const memoryClaims = globalThis.__bookStoreWebhookClaims ??= new Set()
const memoryNotified = globalThis.__bookStoreNotifiedInvoices ??= new Set()

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
const hasRedis = Boolean(redisUrl && redisToken)

async function redisCommand(command) {
  if (!hasRedis) return null

  const response = await fetch(redisUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redisToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) throw new Error('Не вдалося звернутися до сховища замовлень')
  const data = await response.json()
  return data.result
}

function orderKey(invoiceId) {
  return `book-store:order:${invoiceId}`
}

function claimKey(invoiceId) {
  return `book-store:claim:${invoiceId}`
}

function notifiedKey(invoiceId) {
  return `book-store:notified:${invoiceId}`
}

export function storageMode() {
  return hasRedis ? 'redis' : 'memory'
}

export async function savePendingOrder(invoiceId, order) {
  if (hasRedis) {
    await redisCommand(['SET', orderKey(invoiceId), JSON.stringify(order), 'EX', '172800'])
    return
  }

  memoryOrders.set(invoiceId, order)
}

export async function getPendingOrder(invoiceId) {
  if (hasRedis) {
    const value = await redisCommand(['GET', orderKey(invoiceId)])
    return value ? JSON.parse(value) : null
  }

  return memoryOrders.get(invoiceId) ?? null
}

export async function claimWebhook(invoiceId) {
  if (hasRedis) {
    const result = await redisCommand(['SET', claimKey(invoiceId), '1', 'NX', 'EX', '300'])
    return result === 'OK'
  }

  if (memoryClaims.has(invoiceId)) return false
  memoryClaims.add(invoiceId)
  return true
}

export async function wasInvoiceNotified(invoiceId) {
  if (hasRedis) return Boolean(await redisCommand(['EXISTS', notifiedKey(invoiceId)]))
  return memoryNotified.has(invoiceId)
}

export async function markInvoiceNotified(invoiceId) {
  if (hasRedis) {
    await redisCommand(['SET', notifiedKey(invoiceId), '1', 'EX', '2592000'])
    await redisCommand(['DEL', orderKey(invoiceId)])
    return
  }

  memoryNotified.add(invoiceId)
  memoryOrders.delete(invoiceId)
}

export async function releaseWebhookClaim(invoiceId) {
  if (hasRedis) {
    await redisCommand(['DEL', claimKey(invoiceId)])
    return
  }

  memoryClaims.delete(invoiceId)
}
