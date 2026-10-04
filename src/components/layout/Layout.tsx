import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-6">
          <p>Healthy Recipes — eat well with simple, nourishing cooking.</p>
          <p>Recipe data provided for discovery. Always cook to your own taste.</p>
        </div>
      </footer>
    </div>
  )
}
