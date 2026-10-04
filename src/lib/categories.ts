import type { RecipeSearchParams } from '../types/recipe'

export type CategoryDefinition = {
  slug: string
  params: RecipeSearchParams
}

export const CATEGORIES: CategoryDefinition[] = [
  { slug: 'breakfast', params: { mealType: 'breakfast' } },
  { slug: 'lunch', params: { mealType: 'lunch' } },
  { slug: 'dinner', params: { mealType: 'dinner' } },
  { slug: 'healthy', params: { query: 'healthy', sort: 'healthiness' } },
  { slug: 'high-protein', params: { minProtein: 25 } },
  { slug: 'low-carb', params: { maxCarbs: 20 } },
  { slug: 'vegetarian', params: { diet: 'vegetarian' } },
  { slug: 'vegan', params: { diet: 'vegan' } },
  { slug: 'dessert', params: { mealType: 'dessert' } },
  { slug: 'snack', params: { mealType: 'snack' } },
]

export const HOME_CATEGORIES = CATEGORIES.filter((category) =>
  [
    'breakfast',
    'lunch',
    'dinner',
    'healthy',
    'high-protein',
    'low-carb',
    'vegetarian',
    'vegan',
    'dessert',
  ].includes(category.slug),
)

export const CATEGORY_NAV = CATEGORIES.filter((category) =>
  [
    'breakfast',
    'lunch',
    'dinner',
    'dessert',
    'snack',
    'vegetarian',
    'vegan',
    'high-protein',
    'low-carb',
  ].includes(category.slug),
)

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  const normalized = slug.trim().toLowerCase()
  if (normalized === 'desserts') return CATEGORIES.find((item) => item.slug === 'dessert')
  return CATEGORIES.find((item) => item.slug === normalized)
}

export function getCategorySearchParams(slug: string): RecipeSearchParams | null {
  return getCategoryBySlug(slug)?.params ?? null
}
