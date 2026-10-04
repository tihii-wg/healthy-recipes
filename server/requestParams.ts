type QueryValue = string | string[] | undefined

type RequestLike = {
  url?: string
  query?: Record<string, QueryValue>
}

/**
 * Build URLSearchParams from a Vercel/Node request.
 * Prefer the URL query string when present; fall back to req.query.
 */
export function getSearchParams(req: RequestLike): URLSearchParams {
  if (req.url) {
    try {
      const fromUrl = new URL(req.url, 'http://localhost').searchParams
      if ([...fromUrl.keys()].length > 0) return fromUrl
    } catch {
      // Invalid URL — fall through to req.query.
    }
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (typeof value === 'string') params.set(key, value)
    else if (Array.isArray(value) && typeof value[0] === 'string') params.set(key, value[0])
  }
  return params
}
