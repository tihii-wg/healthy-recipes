import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'
import type { Recipe } from '../../types/recipe'

function Nutrient({ label, value, unit }: { label: string; value?: number; unit: string }) {
  return (
    <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-stone-700">
      {label} {value == null ? '—' : `${value}${unit}`}
    </span>
  )
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(recipe.id)
  const ready =
    recipe.readyInMinutes == null || recipe.readyInMinutes < 0
      ? null
      : t('units.minutes', { count: recipe.readyInMinutes })

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-[0_8px_30px_rgb(28,25,23,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgb(28,25,23,0.08)]">
      <Link to={`/recipes/${recipe.id}`} className="flex h-full flex-col focus:outline-none">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-brand/10 text-sm text-muted">
              {t('recipe.photoSoon')}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="font-display text-xl leading-snug text-ink group-hover:text-brand-dark">
            {recipe.title}
          </h3>
          <div className="mt-auto flex flex-wrap gap-2">
            <Nutrient label={t('nutrition.short.calories')} value={recipe.nutrition.calories} unit="" />
            <Nutrient label={t('nutrition.short.protein')} value={recipe.nutrition.protein} unit={t('units.grams')} />
            <Nutrient label={t('nutrition.short.carbs')} value={recipe.nutrition.carbs} unit={t('units.grams')} />
            <Nutrient label={t('nutrition.short.fat')} value={recipe.nutrition.fat} unit={t('units.grams')} />
            {ready ? (
              <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-stone-700">
                {ready}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          toggleFavorite(recipe)
        }}
        aria-pressed={favorite}
        aria-label={
          favorite
            ? t('recipe.favoriteRemove', { title: recipe.title })
            : t('recipe.favoriteAdd', { title: recipe.title })
        }
        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand shadow-sm ring-1 ring-stone-200 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <HeartIcon filled={favorite} />
      </button>
    </article>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z"
      />
    </svg>
  )
}
