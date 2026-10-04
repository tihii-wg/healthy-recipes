export type ApiErrorCode =
  | 'invalid'
  | 'not_found'
  | 'rate_limit'
  | 'unavailable'
  | 'network'

export type ApiResult = {
  status: number
  body: Record<string, unknown>
}

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
): ApiResult {
  return { status, body: { error: code, message } }
}
