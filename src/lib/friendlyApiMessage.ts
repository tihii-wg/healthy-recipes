import i18n from '../i18n'
import { RecipeApiError, type RecipeApiErrorCode } from '../types/recipe'

const errorKeys: Record<RecipeApiErrorCode, string> = {
  invalid: 'errors.invalid',
  not_found: 'errors.notFound',
  rate_limit: 'errors.rateLimit',
  unavailable: 'errors.unavailable',
  network: 'errors.network',
  empty: 'errors.empty',
}

export function friendlyApiMessage(error: unknown, fallbackKey = 'errors.unavailable'): string {
  const key = error instanceof RecipeApiError ? errorKeys[error.code] : fallbackKey
  return i18n.t(key)
}
