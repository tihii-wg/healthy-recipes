import { useEffect, useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function SearchBar({
  initialQuery = '',
  size = 'md',
  onSearch,
  onQueryChange,
}: {
  initialQuery?: string
  size?: 'md' | 'lg'
  onSearch?: (query: string) => void
  onQueryChange?: (query: string) => void
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState(initialQuery)
  const fieldId = useId()
  const navigate = useNavigate()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const next = query.trim()
    if (onSearch) {
      onSearch(next)
      return
    }
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : '/search')
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full gap-2">
      <label className="sr-only" htmlFor={fieldId}>
        {t('search.label')}
      </label>
      <input
        id={fieldId}
        value={query}
        onChange={(event) => {
          const next = event.target.value
          setQuery(next)
          onQueryChange?.(next)
        }}
        placeholder={t('search.placeholder')}
        className={`min-w-0 flex-1 rounded-full border border-stone-200 bg-white px-5 text-ink shadow-sm placeholder:text-stone-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 ${
          size === 'lg' ? 'h-14 text-base' : 'h-11 text-sm'
        }`}
      />
      <button
        type="submit"
        className={`shrink-0 rounded-full bg-brand px-5 font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
          size === 'lg' ? 'h-14' : 'h-11'
        }`}
      >
        {t('search.button')}
      </button>
    </form>
  )
}
