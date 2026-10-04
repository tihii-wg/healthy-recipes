import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { EmptyState } from '../components/states/Feedback'
import { useFavorites } from '../hooks/useFavorites'

export function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <>
      <Seo
        title="Favorite recipes — Healthy Recipes"
        description="Recipes you saved on this device. Favorites stay in your browser — no account needed."
      />
      <h1 className="font-display text-4xl">Favorites</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Saved on this device only. You can add or remove recipes anytime without creating an account.
      </p>
      <div className="mt-8">
        {favorites.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            message="Tap the heart on a recipe you like. It will still be here after you refresh."
            action={
              <Link to="/recipes" className="font-semibold text-brand-dark">
                Discover recipes
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
