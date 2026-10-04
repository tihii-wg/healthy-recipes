import type { RecipeNutrition } from '../../types/recipe'
import { NutritionSkeleton } from '../skeletons/RecipeSkeletons'

const items: { key: keyof RecipeNutrition; label: string; unit: string }[] = [
  { key: 'calories', label: 'Calories', unit: '' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
]

export function NutritionPanel({
  nutrition,
  isLoading,
}: {
  nutrition: RecipeNutrition
  isLoading?: boolean
}) {
  if (isLoading) return <NutritionSkeleton />

  const hasAny = items.some((item) => nutrition[item.key] != null)
  if (!hasAny) {
    return (
      <p className="rounded-2xl bg-cream px-4 py-5 text-muted">
        Nutrition details aren’t available for this recipe.
      </p>
    )
  }

  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.key} className="rounded-2xl bg-cream px-4 py-5">
          <dt className="text-sm text-muted">{item.label}</dt>
          <dd className="mt-1 font-display text-3xl text-ink">
            {nutrition[item.key] == null ? '—' : `${nutrition[item.key]}${item.unit}`}
          </dd>
        </div>
      ))}
    </dl>
  )
}
