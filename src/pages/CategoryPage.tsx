import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { Pagination } from '../components/Pagination'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '../components/skeletons/RecipeSkeletons'
import { EmptyState, ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { categoryCopy } from '../lib/categoryCopy'
import { CATEGORY_NAV, getCategoryBySlug } from '../lib/categories'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { getRecipesByCategory } from '../services/recipeService'

export function CategoryPage() {
  const { t } = useTranslation()
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
        title={t('category.notFoundTitle')}
        message={t('category.notFoundMessage')}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORY_NAV.map((item) => (
              <Link key={item.slug} to={`/category/${item.slug}`} className="rounded-full bg-cream px-3 py-1.5">
                {categoryCopy(t, item.slug).label}
              </Link>
            ))}
          </div>
        }
      />
    )
  }

  const copy = categoryCopy(t, definition.slug)
  const totalPages = recipes.data
    ? Math.max(1, Math.ceil(recipes.data.totalResults / (recipes.data.number || 12)))
    : 1

  return (
    <>
      <Seo title={t('category.seoTitle', { label: copy.label })} description={copy.description} />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{t('category.eyebrow')}</p>
      <h1 className="mt-2 font-display text-4xl">{copy.label}</h1>
      <p className="mt-3 max-w-2xl text-muted">{copy.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORY_NAV.map((item) => (
          <Link
            key={item.slug}
            to={`/category/${item.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm ${
              item.slug === definition.slug ? 'bg-brand text-white' : 'bg-white text-stone-700 ring-1 ring-stone-200'
            }`}
          >
            {categoryCopy(t, item.slug).label}
          </Link>
        ))}
      </div>
      <div className="mt-8">
        {recipes.isLoading ? <RecipeGridSkeleton /> : null}
        {recipes.isError ? (
          <ErrorState
            title={t('category.loadErrorTitle')}
            message={friendlyApiMessage(recipes.error, 'errors.categoryFallback')}
          />
        ) : null}
        {recipes.data && recipes.data.results.length === 0 ? (
          <EmptyState title={t('category.emptyTitle')} message={t('category.emptyMessage')} />
        ) : null}
        {recipes.data && recipes.data.results.length > 0 ? (
          <>
            <RecipeGrid recipes={recipes.data.results} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(nextPage) => setSearchParams({ page: String(nextPage) })}
            />
          </>
        ) : null}
      </div>
    </>
  )
}
