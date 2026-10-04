import { apiError, type ApiResult } from './errors'

const SPOONACULAR_BASE = 'https://api.spoonacular.com'

function getApiKey(): string | null {
  const key = process.env.SPOONACULAR_API_KEY?.trim()
  return key ? key : null
}

export async function spoonacularGet(
  pathname: string,
  params: Record<string, string | number | undefined>,
): Promise<ApiResult> {
  const apiKey = getApiKey()
  if (!apiKey) {
    return apiError(
      503,
      'unavailable',
      'Recipes are temporarily unavailable. Please try again later.',
    )
  }

  const url = new URL(pathname, SPOONACULAR_BASE)
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue
    url.searchParams.set(key, String(value))
  }
  url.searchParams.set('apiKey', apiKey)

  let response: Response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    return apiError(503, 'network', 'We could not reach the recipe service. Check your connection and try again.')
  }

  if (response.status === 402 || response.status === 429) {
    return apiError(
      429,
      'rate_limit',
      'We are receiving a lot of recipe requests right now. Please wait a moment and try again.',
    )
  }

  if (response.status === 401 || response.status === 403) {
    return apiError(503, 'unavailable', 'Recipes are temporarily unavailable. Please try again later.')
  }

  if (response.status === 404) {
    return apiError(404, 'not_found', 'We could not find that recipe.')
  }

  if (!response.ok) {
    return apiError(502, 'unavailable', 'Recipes are temporarily unavailable. Please try again later.')
  }

  try {
    const body = (await response.json()) as Record<string, unknown>
    return { status: 200, body }
  } catch {
    return apiError(502, 'unavailable', 'Recipes are temporarily unavailable. Please try again later.')
  }
}
