import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-cream text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        {t('nav.skip')}
      </a>
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-6">
          <p>{t('footer.tagline')}</p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  )
}
