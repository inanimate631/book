import { getNovaPoshtaErrorStatus, getWarehouses } from '../_lib/novaPoshta.mjs'
import { handleCors } from '../_lib/cors.mjs'

export default async function handler(request, response) {
  if (handleCors(request, response)) return

  if (request.method !== 'GET') {
    response.status(405).json({ message: 'Method not allowed' })
    return
  }

  try {
    const url = new URL(request.url, `https://${request.headers.host || 'localhost'}`)
    const warehouses = await getWarehouses(url.searchParams.get('cityRef'))
    response.status(200).json({ data: warehouses })
  } catch (error) {
    response.status(getNovaPoshtaErrorStatus(error)).json({
      message: error instanceof Error ? error.message : 'Помилка Нової пошти',
    })
  }
}
