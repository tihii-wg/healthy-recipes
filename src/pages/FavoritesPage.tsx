import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { EmptyState } from '../components/states/Feedback'
import { useFavorites } from '../hooks/useFavorites'

export function FavoritesPage() {
  const { t } = useTranslation()
  const { favorites } = useFavorites()

  return (
    <>
      <Seo title={t('favorites.seoTitle')} description={t('favorites.seoDescription')} />
      <h1 className="font-display text-4xl">{t('favorites.title')}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t('favorites.lead')}</p>
      <div className="mt-8">
        {favorites.length === 0 ? (
          <EmptyState
            title={t('favorites.emptyTitle')}
            message={t('favorites.emptyMessage')}
            action={
              <Link to="/recipes" className="font-semibold text-brand-dark">
                {t('favorites.discover')}
              </Link>
            }
          />
        ) : (
          <RecipeGrid recipes={favorites} />
        )}
      </div>
    </>
  )
}
