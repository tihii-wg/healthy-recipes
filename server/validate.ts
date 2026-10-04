import { z } from 'zod'

const mealTypes = [
  'main course',
  'side dish',
  'dessert',
  'appetizer',
  'salad',
  'bread',
  'breakfast',
  'soup',
  'beverage',
  'sauce',
  'marinade',
  'fingerfood',
  'snack',
  'drink',
  'lunch',
  'dinner',
] as const

const diets = [
  'gluten free',
  'ketogenic',
  'vegetarian',
  'lacto-vegetarian',
  'ovo-vegetarian',
  'vegan',
  'pescetarian',
  'paleo',
  'primal',
  'low fodmap',
  'whole30',
] as const

const querySchema = z
  .string()
  .trim()
  .max(100)
  .regex(/^[\p{L}\p{N}\s,'&+.-]*$/u, 'Enter a simpler search term.')

export const searchQuerySchema = z.object({
  query: z.string().optional(),
  type: z.string().optional(),
  diet: z.string().optional(),
  cuisine: z.string().optional(),
  maxCalories: z.coerce.number().int().min(1).max(5000).optional(),
  minProtein: z.coerce.number().int().min(0).max(300).optional(),
  maxCarbs: z.coerce.number().int().min(0).max(500).optional(),
  maxFat: z.coerce.number().int().min(0).max(300).optional(),
  maxReadyTime: z.coerce.number().int().min(1).max(600).optional(),
  offset: z.coerce.number().int().min(0).max(900).optional(),
  number: z.coerce.number().int().min(1).max(24).optional(),
  sort: z.enum(['healthiness', 'popularity', 'time', 'calories', 'protein']).optional(),
})

export const randomQuerySchema = z.object({
  number: z.coerce.number().int().min(1).max(12).optional(),
  tags: z
    .string()
    .trim()
    .max(80)
    .regex(/^[\p{L}\p{N}\s,.-]*$/u)
    .optional(),
})

export const recipeIdSchema = z.coerce.number().int().positive()

export function parseSearchParams(searchParams: URLSearchParams) {
  const raw = Object.fromEntries(searchParams.entries())
  const parsed = searchQuerySchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false as const, message: 'Some search filters look invalid. Adjust them and try again.' }
  }

  const data = parsed.data

  if (data.query) {
    const q = querySchema.safeParse(data.query)
    if (!q.success) {
      return { ok: false as const, message: 'Enter a simpler search term.' }
    }
    data.query = q.data
  }

  if (data.type && !mealTypes.includes(data.type.toLowerCase() as (typeof mealTypes)[number])) {
    return { ok: false as const, message: 'That meal type is not supported.' }
  }

  if (data.diet && !diets.includes(data.diet.toLowerCase() as (typeof diets)[number])) {
    return { ok: false as const, message: 'That diet filter is not supported.' }
  }

  if (data.cuisine) {
    const cuisine = querySchema.safeParse(data.cuisine)
    if (!cuisine.success) {
      return { ok: false as const, message: 'That cuisine filter looks invalid.' }
    }
    data.cuisine = cuisine.data
  }

  return { ok: true as const, data }
}

export function parseRandomParams(searchParams: URLSearchParams) {
  const parsed = randomQuerySchema.safeParse(Object.fromEntries(searchParams.entries()))
  if (!parsed.success) {
    return { ok: false as const, message: 'Random recipe request looks invalid.' }
  }
  return { ok: true as const, data: parsed.data }
}

export function parseRecipeId(value: string) {
  const parsed = recipeIdSchema.safeParse(value)
  if (!parsed.success) {
    return { ok: false as const }
  }
  return { ok: true as const, id: parsed.data }
}
