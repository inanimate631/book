export type NovaPoshtaOption = {
  ref: string
  label: string
}

async function requestNovaPoshta<T>(url: string) {
  const response = await fetch(url)
  const payload = await response.json().catch(() => ({})) as { data?: T; message?: string }
  if (!response.ok) throw new Error(payload.message ?? 'Не вдалося отримати дані Нової пошти')
  return payload.data ?? ([] as T)
}

export function searchNovaPoshtaCities(search: string) {
  return requestNovaPoshta<NovaPoshtaOption[]>(`/api/nova-poshta/cities?search=${encodeURIComponent(search)}`)
}

export function getNovaPoshtaWarehouses(cityRef: string) {
  return requestNovaPoshta<NovaPoshtaOption[]>(`/api/nova-poshta/warehouses?cityRef=${encodeURIComponent(cityRef)}`)
}
