import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { Pagination } from '../components/Pagination'
import { SearchBar } from '../components/SearchBar'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '../components/skeletons/RecipeSkeletons'
import { EmptyState, ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { useDebounce } from '../hooks/useDebounce'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { searchRecipes } from '../services/recipeService'

export function SearchPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryFromUrl = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(queryFromUrl)
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    setQuery(queryFromUrl)
  }, [queryFromUrl])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    const current = searchParams.get('q') ?? ''
    if (trimmed === current) return
    const next = new URLSearchParams()
    if (trimmed) next.set('q', trimmed)
    setSearchParams(next, { replace: true })
  }, [debouncedQuery, searchParams, setSearchParams])

  const params = useMemo(
    () => ({
      query: debouncedQuery.trim() || undefined,
      number: 12,
      offset: (page - 1) * 12,
    }),
    [debouncedQuery, page],
  )

  const enabled = Boolean(debouncedQuery.trim())
  const results = useQuery({
    queryKey: queryKeys.search(params),
    queryFn: () => searchRecipes(params),
    enabled,
    staleTime: STALE_TIME.search,
  })

  const totalPages = results.data
    ? Math.max(1, Math.ceil(results.data.totalResults / (results.data.number || 12)))
    : 1

  return (
    <>
      <Seo
        title={query ? t('search.seoTitleQuery', { query }) : t('search.seoTitle')}
        description={t('search.seoDescription')}
      />
      <h1 className="font-display text-4xl">{t('search.title')}</h1>
      <p className="mt-2 text-muted">{t('search.lead')}</p>
      <div className="mt-6 max-w-2xl">
        <SearchBar
          initialQuery={query}
          size="lg"
          onQueryChange={setQuery}
          onSearch={(next) => {
            setQuery(next)
            setSearchParams(next ? { q: next } : {}, { replace: true })
          }}
        />
      </div>
      <div className="mt-8">
        {!enabled ? <EmptyState title={t('search.startTitle')} message={t('search.startMessage')} /> : null}
        {enabled && results.isLoading ? <RecipeGridSkeleton /> : null}
        {enabled && results.isError ? (
          <ErrorState
            title={t('search.unavailableTitle')}
            message={friendlyApiMessage(results.error, 'errors.searchFallback')}
          />
        ) : null}
        {enabled && results.data && results.data.results.length === 0 ? (
          <EmptyState title={t('search.emptyTitle')} message={t('search.emptyMessage')} />
        ) : null}
        {enabled && results.data && results.data.results.length > 0 ? (
          <>
            <RecipeGrid recipes={results.data.results} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(nextPage) => setSearchParams({ q: query, page: String(nextPage) })}
            />
          </>
        ) : null}
      </div>
    </>
  )
}
