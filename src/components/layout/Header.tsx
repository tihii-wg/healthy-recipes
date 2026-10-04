import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../../lib/categories'
import { SearchBar } from '../SearchBar'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/category/breakfast', label: 'Categories' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <NavLink to="/" className="font-display text-xl text-ink md:text-2xl">
          Healthy Recipes
        </NavLink>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                const active =
                  item.label === 'Categories'
                    ? location.pathname.startsWith('/category/')
                    : isActive
                return `text-sm font-medium ${active ? 'text-brand-dark' : 'text-stone-600 hover:text-ink'}`
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden min-w-0 max-w-md flex-1 items-center gap-3 lg:flex">
          <SearchBar />
        </div>
        <NavLink
          to="/search"
          className="ml-auto rounded-full px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-cream lg:ml-0"
        >
          Search
        </NavLink>
        <NavLink
          to="/favorites"
          className="rounded-full px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-cream"
        >
          Favorites
        </NavLink>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path fill="currentColor" d="M4 7h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            )}
          </svg>
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-stone-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="text-base font-medium text-ink">
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/favorites" className="text-base font-medium text-ink">
              Favorites
            </NavLink>
          </nav>
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Categories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 9).map((category) => (
                <NavLink
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="rounded-full bg-cream px-3 py-1.5 text-sm text-stone-700"
                >
                  {category.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="mt-4 lg:hidden">
            <SearchBar />
          </div>
        </div>
      ) : null}
    </header>
  )
}
