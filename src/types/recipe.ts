export type RecipeNutrition = {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export type RecipeIngredient = {
  id: number
  name: string
  amount: string
}

export type RecipeInstruction = {
  number: number
  step: string
}

export type Recipe = {
  id: number
  title: string
  image: string | null
  description: string
  servings: number | null
  prepTimeMinutes: number | null
  cookTimeMinutes: number | null
  readyInMinutes: number | null
  nutrition: RecipeNutrition
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  diets: string[]
}

export type RecipeSearchParams = {
  query?: string
  mealType?: string
  diet?: string
  cuisine?: string
  maxCalories?: number
  minProtein?: number
  maxCarbs?: number
  maxFat?: number
  maxReadyTime?: number
  offset?: number
  number?: number
  sort?: 'healthiness' | 'popularity' | 'time' | 'calories' | 'protein'
}

export type RecipeSearchResult = {
  results: Recipe[]
  totalResults: number
  offset: number
  number: number
}

export type RecipeApiErrorCode =
  | 'invalid'
  | 'not_found'
  | 'rate_limit'
  | 'unavailable'
  | 'network'
  | 'empty'

export class RecipeApiError extends Error {
  readonly code: RecipeApiErrorCode
  readonly status: number | undefined

  constructor(message: string, code: RecipeApiErrorCode, status?: number) {
    super(message)
    this.name = 'RecipeApiError'
    this.code = code
    this.status = status
  }
}
