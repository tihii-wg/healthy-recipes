import type { TFunction } from 'i18next'

const categoryMessageKeys = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  healthy: 'healthy',
  'high-protein': 'highProtein',
  'low-carb': 'lowCarb',
  vegetarian: 'vegetarian',
  vegan: 'vegan',
  dessert: 'dessert',
  snack: 'snack',
} as const

export function categoryCopy(t: TFunction, slug: string): { label: string; description: string } {
  const key = categoryMessageKeys[slug as keyof typeof categoryMessageKeys]
  if (!key) return { label: slug, description: '' }
  return {
    label: t(`categories.${key}.label`),
    description: t(`categories.${key}.description`),
  }
}
