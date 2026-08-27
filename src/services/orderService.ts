export type OrderPayload = {
  name: string
  surname: string
  phone: string
  email: string
  address: string
  payment: 'card' | 'cash'
  comment: string
}

const emailEndpoint = 'https://formsubmit.co/ajax/book@denkiiashko.com'

export async function createCardInvoice(order: OrderPayload) {
  const response = await fetch('/api/create-invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })

  const data = await response.json().catch(() => ({})) as { pageUrl?: string; message?: string }
  if (!response.ok || !data.pageUrl) {
    throw new Error(data.message ?? 'Не вдалося створити рахунок Monobank')
  }

  return data.pageUrl
}

export async function submitCashOrder(order: OrderPayload) {
  const payload = new URLSearchParams({
    name: order.name,
    surname: order.surname,
    phone: order.phone,
    email: order.email,
    address: order.address,
    payment: 'Післяплата',
    comment: order.comment,
    _replyto: order.email,
    _subject: 'Замовлення книги — післяплата',
    _template: 'table',
  })

  const response = await fetch(emailEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: payload,
  })

  if (!response.ok) throw new Error('Не вдалося надіслати замовлення')
}
