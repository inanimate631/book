export type OrderPayload = {
  name: string
  surname: string
  phone: string
  email: string
  address: string
  payment: 'card'
  comment: string
}

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
