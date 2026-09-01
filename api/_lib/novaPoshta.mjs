const novaPoshtaApiUrl = process.env.NOVA_POSHTA_API_URL || 'https://api.novaposhta.ua/v2.0/json/'
const novaPoshtaApiKey = process.env.NOVA_POSHTA_API_KEY
const cacheTtlMs = Number(process.env.NOVA_POSHTA_CACHE_TTL_MS || 24 * 60 * 60 * 1000)
const responseCache = new Map()

function getCached(key) {
  const cached = responseCache.get(key)
  if (!cached) return null
  if (cached.expiresAt <= Date.now()) {
    responseCache.delete(key)
    return null
  }
  return cached.value
}

function setCached(key, value) {
  responseCache.set(key, { value, expiresAt: Date.now() + cacheTtlMs })
  return value
}

async function callNovaPoshta(calledMethod, methodProperties) {
  if (!novaPoshtaApiKey) throw new Error('NOVA_POSHTA_API_KEY не налаштований на сервері')

  const response = await fetch(novaPoshtaApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: novaPoshtaApiKey,
      modelName: 'Address',
      calledMethod,
      methodProperties,
    }),
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    const message = Array.isArray(payload.errors) ? payload.errors.join(', ') : ''
    throw new Error(message || 'Не вдалося отримати дані Нової пошти')
  }

  return Array.isArray(payload.data) ? payload.data : []
}

function cityOption(city) {
  return {
    ref: city.Ref,
    label: city.Description || city.DescriptionRu || '',
  }
}

function warehouseOption(warehouse) {
  return {
    ref: warehouse.Ref,
    label: warehouse.Description || warehouse.DescriptionRu || '',
  }
}

export async function getCities(search) {
  const normalizedSearch = String(search || '').trim()
  if (normalizedSearch.length < 2) return []

  const cacheKey = `cities:${normalizedSearch.toLocaleLowerCase('uk-UA')}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const cities = await callNovaPoshta('getCities', {
    FindByString: normalizedSearch,
    Limit: 50,
    Page: '1',
  })

  return setCached(cacheKey, cities.map(cityOption).filter((city) => city.ref && city.label))
}

export async function getWarehouses(cityRef) {
  const normalizedCityRef = String(cityRef || '').trim()
  if (!normalizedCityRef) return []

  const cacheKey = `warehouses:${normalizedCityRef}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const warehouses = await callNovaPoshta('getWarehouses', {
    CityRef: normalizedCityRef,
    Limit: 500,
    Page: '1',
  })

  return setCached(cacheKey, warehouses.map(warehouseOption).filter((warehouse) => warehouse.ref && warehouse.label))
}

export function getNovaPoshtaErrorStatus(error) {
  return error instanceof Error && error.message.includes('NOVA_POSHTA_API_KEY') ? 503 : 502
}
