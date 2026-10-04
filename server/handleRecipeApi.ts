import { apiError, type ApiResult } from './errors'
import { parseRandomParams, parseRecipeId, parseSearchParams } from './validate'
import { spoonacularGet } from './spoonacular'

function recipeIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/api\/recipes\/(\d+)\/?$/)
  return match?.[1] ?? null
}

export async function handleRecipeApi(
  method: string,
  pathname: string,
  searchParams: URLSearchParams,
): Promise<ApiResult> {
  if (method !== 'GET' && method !== 'HEAD') {
    return apiError(405, 'invalid', 'This request is not supported.')
  }

  const cleanPath = pathname.replace(/\/$/, '') || pathname

  if (cleanPath === '/api/recipes/search') {
    const parsed = parseSearchParams(searchParams)
    if (!parsed.ok) {
      return apiError(400, 'invalid', parsed.message)
    }

    const { data } = parsed
    return spoonacularGet('/recipes/complexSearch', {
      query: data.query,
      type: data.type,
      diet: data.diet,
      cuisine: data.cuisine,
      maxCalories: data.maxCalories,
      minProtein: data.minProtein,
      maxCarbs: data.maxCarbs,
      maxFat: data.maxFat,
      maxReadyTime: data.maxReadyTime,
      offset: data.offset ?? 0,
      number: data.number ?? 12,
      sort: data.sort,
      addRecipeInformation: 'true',
      addRecipeNutrition: 'true',
      instructionsRequired: 'true',
      fillIngredients: 'true',
    })
  }

  if (cleanPath === '/api/recipes/random') {
    const parsed = parseRandomParams(searchParams)
    if (!parsed.ok) {
      return apiError(400, 'invalid', parsed.message)
    }

    return spoonacularGet('/recipes/random', {
      number: parsed.data.number ?? 8,
      tags: parsed.data.tags,
    })
  }

  const id = recipeIdFromPath(cleanPath)
  if (id) {
    const parsed = parseRecipeId(id)
    if (!parsed.ok) {
      return apiError(400, 'invalid', 'That recipe link looks invalid.')
    }

    return spoonacularGet(`/recipes/${parsed.id}/information`, {
      includeNutrition: 'true',
    })
  }

  return apiError(404, 'not_found', 'We could not find that recipe.')
}
