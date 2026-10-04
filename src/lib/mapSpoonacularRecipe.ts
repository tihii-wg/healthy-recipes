import type {
  Recipe,
  RecipeIngredient,
  RecipeInstruction,
  RecipeNutrition,
} from '../types/recipe'

type SpoonacularNutrient = {
  name?: string
  amount?: number
  unit?: string
}

type SpoonacularIngredient = {
  id?: number
  name?: string
  original?: string
  amount?: number
  unit?: string
}

type SpoonacularStep = {
  number?: number
  step?: string
}

type SpoonacularInstructionBlock = {
  steps?: SpoonacularStep[]
}

export type SpoonacularRecipe = {
  id?: number
  title?: string
  image?: string | null
  summary?: string
  servings?: number
  preparationMinutes?: number
  cookingMinutes?: number
  readyInMinutes?: number
  diets?: string[]
  extendedIngredients?: SpoonacularIngredient[]
  analyzedInstructions?: SpoonacularInstructionBlock[]
  instructions?: string
  nutrition?: {
    nutrients?: SpoonacularNutrient[]
  }
}

function stripHtml(value?: string): string {
  if (!value) return ''
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function nutrientAmount(nutrients: SpoonacularNutrient[] | undefined, name: string): number | undefined {
  const match = nutrients?.find((item) => item.name?.toLowerCase() === name.toLowerCase())
  if (typeof match?.amount !== 'number' || Number.isNaN(match.amount)) return undefined
  return Math.round(match.amount)
}

function mapNutrition(raw: SpoonacularRecipe): RecipeNutrition {
  const nutrients = raw.nutrition?.nutrients
  return {
    calories: nutrientAmount(nutrients, 'Calories'),
    protein: nutrientAmount(nutrients, 'Protein'),
    carbs: nutrientAmount(nutrients, 'Carbohydrates'),
    fat: nutrientAmount(nutrients, 'Fat'),
  }
}

function mapIngredients(raw: SpoonacularRecipe): RecipeIngredient[] {
  if (!raw.extendedIngredients?.length) return []
  return raw.extendedIngredients.map((ingredient, index) => ({
    id: ingredient.id ?? index,
    name: ingredient.name?.trim() || 'Ingredient',
    amount: ingredient.original?.trim() || [ingredient.amount, ingredient.unit, ingredient.name]
      .filter(Boolean)
      .join(' '),
  }))
}

function instructionsFromText(value?: string): RecipeInstruction[] {
  if (!value?.trim()) return []

  const listItems = [...value.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean)

  const chunks =
    listItems.length > 0
      ? listItems
      : stripHtml(value.replace(/<\/(p|div|li|h[1-6]|br)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n'))
          .split(/\n+/)
          .map((line) => line.replace(/^\d+[).\s-]+/, '').trim())
          .filter(Boolean)

  return chunks.map((step, index) => ({ number: index + 1, step }))
}

function mapInstructions(raw: SpoonacularRecipe): RecipeInstruction[] {
  const steps = raw.analyzedInstructions?.flatMap((block) => block.steps ?? []) ?? []
  const mapped = steps
    .filter((step) => step.step?.trim())
    .map((step, index) => ({
      number: step.number ?? index + 1,
      step: stripHtml(step.step),
    }))
  if (mapped.length > 0) return mapped
  return instructionsFromText(raw.instructions)
}

export function mapSpoonacularRecipe(raw: SpoonacularRecipe): Recipe | null {
  if (typeof raw.id !== 'number' || !raw.title?.trim()) return null

  const prep =
    typeof raw.preparationMinutes === 'number' && raw.preparationMinutes >= 0
      ? raw.preparationMinutes
      : null
  const cook =
    typeof raw.cookingMinutes === 'number' && raw.cookingMinutes >= 0
      ? raw.cookingMinutes
      : null
  const ready =
    typeof raw.readyInMinutes === 'number' && raw.readyInMinutes >= 0
      ? raw.readyInMinutes
      : null

  return {
    id: raw.id,
    title: raw.title.trim(),
    image: raw.image?.trim() || null,
    description: stripHtml(raw.summary),
    servings: typeof raw.servings === 'number' ? raw.servings : null,
    prepTimeMinutes: prep,
    cookTimeMinutes: cook,
    readyInMinutes: ready,
    nutrition: mapNutrition(raw),
    ingredients: mapIngredients(raw),
    instructions: mapInstructions(raw),
    diets: (raw.diets ?? []).map((diet) => diet.trim()).filter(Boolean),
  }
}
