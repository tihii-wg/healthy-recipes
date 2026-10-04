import { useTranslation } from 'react-i18next'
import type { RecipeNutrition } from '../../types/recipe'
import { NutritionSkeleton } from '../skeletons/RecipeSkeletons'

const items: { key: keyof RecipeNutrition; labelKey: 'calories' | 'protein' | 'carbs' | 'fat'; grams: boolean }[] = [
  { key: 'calories', labelKey: 'calories', grams: false },
  { key: 'protein', labelKey: 'protein', grams: true },
  { key: 'carbs', labelKey: 'carbs', grams: true },
  { key: 'fat', labelKey: 'fat', grams: true },
]

export function NutritionPanel({
  nutrition,
  isLoading,
}: {
  nutrition: RecipeNutrition
  isLoading?: boolean
}) {
  const { t } = useTranslation()

  if (isLoading) return <NutritionSkeleton />

  const hasAny = items.some((item) => nutrition[item.key] != null)
  if (!hasAny) {
    return <p className="rounded-2xl bg-cream px-4 py-5 text-muted">{t('nutrition.unavailable')}</p>
  }

  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.key} className="rounded-2xl bg-cream px-4 py-5">
          <dt className="text-sm text-muted">{t(`nutrition.${item.labelKey}`)}</dt>
          <dd className="mt-1 font-display text-3xl text-ink">
            {nutrition[item.key] == null ? '—' : `${nutrition[item.key]}${item.grams ? t('units.grams') : ''}`}
          </dd>
        </div>
      ))}
    </dl>
  )
}
