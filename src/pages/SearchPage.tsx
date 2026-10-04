import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { SearchBar } from '../components/SearchBar'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '../components/skeletons/RecipeSkeletons'
import { EmptyState, ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { useDebounce } from '../hooks/useDebounce'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { searchRecipes } from '../services/recipeService'

export function SearchPage() {
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
        title={query ? `${query} recipes — Healthy Recipe` : 'Search recipes — Healthy Recipe'}
        description="Search healthy recipes by name, ingredient, dish, or cuisine."
      />
      <h1 className="font-display text-4xl">Search</h1>
      <p className="mt-2 text-muted">Find recipes by name, ingredient, dish, or cuisine.</p>
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
        {!enabled ? (
          <EmptyState
            title="Start typing to search"
            message="Try “salmon”, “chickpeas”, or “Mediterranean”."
          />
        ) : null}
        {enabled && results.isLoading ? <RecipeGridSkeleton /> : null}
        {enabled && results.isError ? (
          <ErrorState
            title="Search is unavailable"
            message={friendlyApiMessage(results.error, 'Please try again shortly.')}
          />
        ) : null}
        {enabled && results.data && results.data.results.length === 0 ? (
          <EmptyState
            title="No recipes found"
            message="Try a different ingredient or a simpler dish name."
          />
        ) : null}
        {enabled && results.data && results.data.results.length > 0 ? (
          <>
            <RecipeGrid recipes={results.data.results} />
            {totalPages > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setSearchParams({ q: query, page: String(page - 1) })}
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
                  onClick={() => setSearchParams({ q: query, page: String(page + 1) })}
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
