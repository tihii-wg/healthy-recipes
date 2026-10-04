import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '../components/skeletons/RecipeSkeletons'
import { EmptyState, ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { CATEGORY_NAV, getCategoryBySlug } from '../lib/categories'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { getRecipesByCategory } from '../services/recipeService'

export function CategoryPage() {
  const { category = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const definition = getCategoryBySlug(category)
  const offset = (page - 1) * 12

  const recipes = useQuery({
    queryKey: queryKeys.category(definition?.slug ?? category, offset),
    queryFn: () => getRecipesByCategory(category, offset),
    enabled: Boolean(definition),
    staleTime: STALE_TIME.category,
  })

  if (!definition) {
    return (
      <ErrorState
        title="Category not found"
        message="Choose one of the healthy categories below."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORY_NAV.map((item) => (
              <Link key={item.slug} to={`/category/${item.slug}`} className="rounded-full bg-cream px-3 py-1.5">
                {item.label}
              </Link>
            ))}
          </div>
        }
      />
    )
  }

  const totalPages = recipes.data
    ? Math.max(1, Math.ceil(recipes.data.totalResults / (recipes.data.number || 12)))
    : 1

  return (
    <>
      <Seo
        title={`${definition.label} recipes — Healthy Recipe`}
        description={definition.description}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Category</p>
      <h1 className="mt-2 font-display text-4xl">{definition.label}</h1>
      <p className="mt-3 max-w-2xl text-muted">{definition.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORY_NAV.map((item) => (
          <Link
            key={item.slug}
            to={`/category/${item.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm ${
              item.slug === definition.slug ? 'bg-brand text-white' : 'bg-white text-stone-700 ring-1 ring-stone-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mt-8">
        {recipes.isLoading ? <RecipeGridSkeleton /> : null}
        {recipes.isError ? (
          <ErrorState
            title="This category could not be loaded"
            message={friendlyApiMessage(recipes.error, 'Please try again shortly.')}
          />
        ) : null}
        {recipes.data && recipes.data.results.length === 0 ? (
          <EmptyState title="No recipes here yet" message="Try another category while we refresh this one." />
        ) : null}
        {recipes.data && recipes.data.results.length > 0 ? (
          <>
            <RecipeGrid recipes={recipes.data.results} />
            {totalPages > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setSearchParams({ page: String(page - 1) })}
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <p className="text-sm text-muted">
                  Page {page} of {Math.min(totalPages, 50)}
                </p>
                <button
                  type="button"
                  disabled={page >= Math.min(totalPages, 50)}
                  onClick={() => setSearchParams({ page: String(page + 1) })}
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  )
}
