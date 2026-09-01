import { getCities, getNovaPoshtaErrorStatus } from '../_lib/novaPoshta.mjs'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ message: 'Method not allowed' })
    return
  }

  try {
    const url = new URL(request.url, `https://${request.headers.host || 'localhost'}`)
    const cities = await getCities(url.searchParams.get('search'))
    response.status(200).json({ data: cities })
  } catch (error) {
    response.status(getNovaPoshtaErrorStatus(error)).json({
      message: error instanceof Error ? error.message : 'Помилка Нової пошти',
    })
  }
}
