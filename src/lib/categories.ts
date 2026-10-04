import type { RecipeSearchParams } from '../types/recipe'

export type CategoryDefinition = {
  slug: string
  label: string
  description: string
  params: RecipeSearchParams
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'breakfast',
    label: 'Breakfast',
    description: 'Bright mornings with protein-forward starts.',
    params: { mealType: 'breakfast' },
  },
  {
    slug: 'lunch',
    label: 'Lunch',
    description: 'Midday meals that keep you going.',
    params: { mealType: 'lunch' },
  },
  {
    slug: 'dinner',
    label: 'Dinner',
    description: 'Satisfying plates for the end of the day.',
    params: { mealType: 'dinner' },
  },
  {
    slug: 'healthy',
    label: 'Healthy',
    description: 'Recipes ranked for overall healthiness.',
    params: { query: 'healthy', sort: 'healthiness' },
  },
  {
    slug: 'high-protein',
    label: 'High Protein',
    description: 'At least 25g of protein per serving.',
    params: { minProtein: 25 },
  },
  {
    slug: 'low-carb',
    label: 'Low Carb',
    description: 'Meals with 20g of carbs or fewer.',
    params: { maxCarbs: 20 },
  },
  {
    slug: 'vegetarian',
    label: 'Vegetarian',
    description: 'Vegetable-first cooking without meat.',
    params: { diet: 'vegetarian' },
  },
  {
    slug: 'vegan',
    label: 'Vegan',
    description: 'Plant-based recipes from Spoonacular’s vegan filter.',
    params: { diet: 'vegan' },
  },
  {
    slug: 'dessert',
    label: 'Desserts',
    description: 'Sweeter finishes, still from real recipes.',
    params: { mealType: 'dessert' },
  },
  {
    slug: 'snack',
    label: 'Snack',
    description: 'Smaller bites between meals.',
    params: { mealType: 'snack' },
  },
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
