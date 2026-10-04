import { mapSpoonacularRecipe, type SpoonacularRecipe } from '../lib/mapSpoonacularRecipe'
import type { Recipe, RecipeSearchParams, RecipeSearchResult } from '../types/recipe'
import { RecipeApiError, type RecipeApiErrorCode } from '../types/recipe'
import { getCategorySearchParams } from '../lib/categories'

type ErrorBody = {
  error?: RecipeApiErrorCode
  message?: string
}

async function request<T>(path: string, params?: URLSearchParams): Promise<T> {
  const url = params?.toString() ? `${path}?${params.toString()}` : path

  let response: Response
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw new RecipeApiError(
      'We could not reach the recipe service. Check your connection and try again.',
      'network',
    )
  }

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    const errorBody = (body ?? {}) as ErrorBody
    const code: RecipeApiErrorCode =
      errorBody.error === 'rate_limit' ||
      errorBody.error === 'not_found' ||
      errorBody.error === 'invalid' ||
      errorBody.error === 'network' ||
      errorBody.error === 'unavailable'
        ? errorBody.error
        : 'unavailable'
    throw new RecipeApiError(
      errorBody.message || 'Recipes are temporarily unavailable. Please try again later.',
      code,
      response.status,
    )
  }

  return body as T
}

function toSearchParams(params: RecipeSearchParams): URLSearchParams {
  const search = new URLSearchParams()
  if (params.query) search.set('query', params.query)
  if (params.mealType) search.set('type', params.mealType)
  if (params.diet) search.set('diet', params.diet)
  if (params.cuisine) search.set('cuisine', params.cuisine)
  if (params.maxCalories != null) search.set('maxCalories', String(params.maxCalories))
  if (params.minProtein != null) search.set('minProtein', String(params.minProtein))
  if (params.maxCarbs != null) search.set('maxCarbs', String(params.maxCarbs))
  if (params.maxFat != null) search.set('maxFat', String(params.maxFat))
  if (params.maxReadyTime != null) search.set('maxReadyTime', String(params.maxReadyTime))
  if (params.offset != null) search.set('offset', String(params.offset))
  if (params.number != null) search.set('number', String(params.number))
  if (params.sort) search.set('sort', params.sort)
  return search
}

type ComplexSearchResponse = {
  results?: SpoonacularRecipe[]
  totalResults?: number
  offset?: number
  number?: number
}

type RandomResponse = {
  recipes?: SpoonacularRecipe[]
}

export async function searchRecipes(params: RecipeSearchParams): Promise<RecipeSearchResult> {
  const data = await request<ComplexSearchResponse>(
    '/api/recipes/search',
    toSearchParams({ number: 12, ...params }),
  )
  const results = (data.results ?? [])
    .map(mapSpoonacularRecipe)
    .filter((recipe): recipe is Recipe => recipe !== null)

  return {
    results,
    totalResults: data.totalResults ?? results.length,
    offset: data.offset ?? params.offset ?? 0,
    number: data.number ?? params.number ?? 12,
  }
}

export async function getRecipeDetails(id: number): Promise<Recipe> {
  const data = await request<SpoonacularRecipe>(`/api/recipes/${id}`)
  const recipe = mapSpoonacularRecipe(data)
  if (!recipe) {
    throw new RecipeApiError('We could not find that recipe.', 'not_found', 404)
  }
  return recipe
}

export async function getRandomRecipes(count = 8, tags?: string): Promise<Recipe[]> {
  const params = new URLSearchParams({ number: String(count) })
  if (tags) params.set('tags', tags)
  const data = await request<RandomResponse>('/api/recipes/random', params)
  return (data.recipes ?? [])
    .map(mapSpoonacularRecipe)
    .filter((recipe): recipe is Recipe => recipe !== null)
}

export async function getRecipesByCategory(category: string, offset = 0): Promise<RecipeSearchResult> {
  const mapped = getCategorySearchParams(category)
  if (!mapped) {
    throw new RecipeApiError('We could not find that category.', 'not_found', 404)
  }
  return searchRecipes({ ...mapped, offset, number: 12 })
}
