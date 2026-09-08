const defaultAllowedOrigins = [
  'https://denkiiashko.com',
  'https://www.denkiiashko.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return new Set([...defaultAllowedOrigins, ...configuredOrigins])
}

export function isAllowedOrigin(origin) {
  return !origin || getAllowedOrigins().has(origin)
}

export function applyCorsHeaders(response, request) {
  const origin = request.headers.origin

  if (origin && isAllowedOrigin(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
  }

  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
  response.setHeader('Access-Control-Max-Age', '86400')
}

export function handleCors(request, response) {
  applyCorsHeaders(response, request)

  if (request.method !== 'OPTIONS') return false

  if (!isAllowedOrigin(request.headers.origin)) {
    response.status(403).json({ message: 'Origin not allowed' })
    return true
  }

  response.status(204).end()
  return true
}
