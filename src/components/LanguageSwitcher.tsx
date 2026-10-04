import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { languages, normalizeLanguage, type AppLanguage } from '../i18n'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const menuId = useId()
  const current = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language)
  const currentIndex = Math.max(
    0,
    languages.findIndex((language) => language.code === current),
  )

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    itemRefs.current[currentIndex]?.focus()
  }, [open, currentIndex])

  function select(code: AppLanguage) {
    void i18n.changeLanguage(code)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
    }
  }

  function onItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      itemRefs.current[(index + 1) % languages.length]?.focus()
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      itemRefs.current[(index - 1 + languages.length) % languages.length]?.focus()
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      itemRefs.current[0]?.focus()
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      itemRefs.current[languages.length - 1]?.focus()
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      select(languages[index].code)
      return
    }
    if (event.key === 'Tab') setOpen(false)
  }

  const currentName = t(`language.${current}`)

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('language.current', { language: currentName })}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onButtonKeyDown}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 text-sm font-semibold text-stone-700 transition duration-150 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:gap-2 sm:px-3"
      >
        <GlobeIcon />
        <span className="sm:hidden" lang={current}>
          {current.toUpperCase()}
        </span>
        <span className="hidden sm:inline" lang={current}>
          {currentName}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t('language.label')}
          className="absolute right-0 z-40 mt-2 w-44 origin-top-right rounded-2xl border border-stone-200 bg-white p-1 shadow-[0_16px_40px_rgb(28,25,23,0.12)]"
        >
          {languages.map((language, index) => {
            const selected = language.code === current
            return (
              <button
                key={language.code}
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                type="button"
                role="menuitemradio"
                lang={language.code}
                aria-checked={selected}
                onClick={() => select(language.code)}
                onKeyDown={(event) => onItemKeyDown(event, index)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  selected
                    ? 'bg-brand/10 font-semibold text-brand-dark'
                    : 'text-stone-700 hover:bg-cream'
                }`}
              >
                {t(`language.${language.code}`)}
                {selected ? <CheckIcon /> : <span className="h-4 w-4" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.75 12h16.5M12 3.75c2.2 2.4 3.3 5.2 3.3 8.25s-1.1 5.85-3.3 8.25c-2.2-2.4-3.3-5.2-3.3-8.25s1.1-5.85 3.3-8.25z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 transition duration-150 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 12.5l4.2 4.2L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
