const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const apiBaseUrl = (configuredApiUrl || (import.meta.env.DEV ? '' : 'https://api.denkiiashko.com'))
  .replace(/\/$/, '')

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`
}
