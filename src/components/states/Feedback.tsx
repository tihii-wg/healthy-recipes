import type { ReactNode } from 'react'

export function ErrorState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-stone-200 bg-white px-6 py-10 text-center shadow-sm"
    >
      <p className="font-display text-2xl text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-muted">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-cream/60 px-6 py-12 text-center">
      <p className="font-display text-2xl text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-muted">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
