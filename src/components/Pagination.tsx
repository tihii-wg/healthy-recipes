import { useTranslation } from 'react-i18next'

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const { t } = useTranslation()
  const pages = Math.min(totalPages, 50)
  if (pages <= 1) return null

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label={t('pagination.label')}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-full border border-stone-200 px-4 py-2 text-sm transition hover:bg-white disabled:opacity-40"
      >
        {t('pagination.previous')}
      </button>
      <p className="text-sm text-muted">{t('pagination.status', { page, total: pages })}</p>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="rounded-full border border-stone-200 px-4 py-2 text-sm transition hover:bg-white disabled:opacity-40"
      >
        {t('pagination.next')}
      </button>
    </nav>
  )
}
