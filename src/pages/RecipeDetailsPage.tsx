import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { NutritionPanel } from '../components/recipe/NutritionPanel'
import { RecipeDetailsSkeleton } from '../components/skeletons/RecipeSkeletons'
import { ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { useFavorites } from '../hooks/useFavorites'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { getRecipeDetails } from '../services/recipeService'
import { RecipeApiError } from '../types/recipe'

function formatTime(value: number | null, label: string) {
  if (value == null || value < 0) return null
  return `${label} ${value} min`
}

export function RecipeDetailsPage() {
  const { id } = useParams()
  const numericId = Number(id)
  const invalidId = !Number.isInteger(numericId) || numericId <= 0
  const { isFavorite, toggleFavorite } = useFavorites()

  const details = useQuery({
    queryKey: queryKeys.details(numericId),
    queryFn: () => getRecipeDetails(numericId),
    enabled: !invalidId,
    staleTime: STALE_TIME.details,
  })

  if (invalidId) {
    return (
      <ErrorState
        title="This recipe link is invalid"
        message="Double-check the address or head back to the recipe list."
        action={
          <Link to="/recipes" className="font-semibold text-brand-dark">
            Browse recipes
          </Link>
        }
      />
    )
  }

  if (details.isLoading) {
    return <RecipeDetailsSkeleton />
  }

  if (details.isError || !details.data) {
    const notFound = details.error instanceof RecipeApiError && details.error.code === 'not_found'
    return (
      <ErrorState
        title={notFound ? 'Recipe not found' : 'This recipe could not be loaded'}
        message={friendlyApiMessage(
          details.error,
          'Please try another recipe or come back in a few minutes.',
        )}
        action={
          <Link to="/recipes" className="font-semibold text-brand-dark">
            Browse recipes
          </Link>
        }
      />
    )
  }

  const recipe = details.data
  const favorite = isFavorite(recipe.id)
  const description =
    recipe.description || 'A healthy recipe with ingredients and steps you can cook at home.'

  return (
    <>
      <Seo title={`${recipe.title} — Healthy Recipe`} description={description.slice(0, 160)} />
      <article>
        <div className="overflow-hidden rounded-[2rem] bg-stone-100 shadow-sm">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="max-h-[520px] w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[240px] items-center justify-center text-muted">
              No photo available for this recipe
            </div>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl leading-tight">{recipe.title}</h1>
            <p className="mt-4 text-muted">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(recipe)}
            aria-pressed={favorite}
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {favorite ? 'Remove from favorites' : 'Save to favorites'}
          </button>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Meta label="Servings" value={recipe.servings ? String(recipe.servings) : '—'} />
          <Meta label="Prep" value={formatTime(recipe.prepTimeMinutes, '') ?? '—'} />
          <Meta label="Cook" value={formatTime(recipe.cookTimeMinutes, '') ?? '—'} />
          <Meta label="Total" value={formatTime(recipe.readyInMinutes, '') ?? '—'} />
        </dl>

        {recipe.diets.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Diet tags">
            {recipe.diets.map((diet) => (
              <li key={diet} className="rounded-full bg-brand/10 px-3 py-1 text-sm text-brand-dark">
                {diet}
              </li>
            ))}
          </ul>
        ) : null}

        <section className="mt-10">
          <h2 className="font-display text-2xl">Nutrition</h2>
          <div className="mt-4">
            <NutritionPanel nutrition={recipe.nutrition} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Ingredients</h2>
          {recipe.ingredients.length === 0 ? (
            <p className="mt-4 text-muted">Ingredient details aren’t available for this recipe.</p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100 rounded-3xl bg-white px-5 py-2 shadow-sm">
              {recipe.ingredients.map((ingredient) => (
                <li key={`${ingredient.id}-${ingredient.name}`} className="py-3">
                  <span className="font-medium">{ingredient.amount || ingredient.name}</span>
                  {ingredient.amount && ingredient.amount.toLowerCase().includes(ingredient.name.toLowerCase())
                    ? null
                    : ` · ${ingredient.name}`}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Instructions</h2>
          {recipe.instructions.length === 0 ? (
            <p className="mt-4 text-muted">Step-by-step instructions aren’t available for this recipe.</p>
          ) : (
            <ol className="mt-4 space-y-4">
              {recipe.instructions.map((step) => (
                <li key={step.number} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    {step.number}
                  </span>
                  <p className="pt-1 leading-relaxed text-stone-700">{step.step}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </article>
    </>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
    </div>
  )
}
