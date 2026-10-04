import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { SearchBar } from '../components/SearchBar'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '../components/skeletons/RecipeSkeletons'
import { EmptyState, ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { HOME_CATEGORIES } from '../lib/categories'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { getRandomRecipes } from '../services/recipeService'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80'

const benefits = [
  {
    title: 'Balanced nutrition',
    body: 'See calories, protein, carbs, and fat at a glance so meals fit your day.',
  },
  {
    title: 'Easy recipes',
    body: 'Clear ingredients and numbered steps that stay readable on a phone.',
  },
  {
    title: 'Personalized choices',
    body: 'Filter by diet, cuisine, and macros — or save favorites on this device.',
  },
]

export function HomePage() {
  const featured = useQuery({
    queryKey: queryKeys.random(8),
    queryFn: () => getRandomRecipes(8),
    staleTime: STALE_TIME.random,
  })

  return (
    <>
      <Seo
        title="Healthy Recipes — Eat better. Feel better."
        description="Discover healthy recipes tailored to your lifestyle, from high-protein dinners to simple vegetarian lunches."
      />
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Nourish daily</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            Eat better. Feel better.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Discover healthy recipes tailored to your lifestyle.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchBar size="lg" />
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgb(28,25,23,0.12)]">
          <img
            src={HERO_IMAGE}
            alt="Colorful bowl of fresh vegetables, grains, and greens"
            className="h-full w-full max-h-[460px] object-cover"
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Popular categories</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {HOME_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="rounded-2xl bg-white px-4 py-5 shadow-sm ring-1 ring-stone-100 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="font-semibold text-ink">{category.label}</span>
              <p className="mt-1 text-sm text-muted">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Featured recipes</h2>
          <Link to="/recipes" className="text-sm font-semibold text-brand-dark">
            Browse all
          </Link>
        </div>
        {featured.isLoading ? <RecipeGridSkeleton /> : null}
        {featured.isError ? (
          <ErrorState
            title="Featured recipes are unavailable"
            message={friendlyApiMessage(
              featured.error,
              'We could not load featured recipes right now.',
            )}
          />
        ) : null}
        {featured.data && featured.data.length === 0 ? (
          <EmptyState title="No featured recipes yet" message="Check back soon for seasonal inspiration." />
        ) : null}
        {featured.data && featured.data.length > 0 ? <RecipeGrid recipes={featured.data} /> : null}
      </section>

      <section className="mt-20 rounded-[2rem] bg-white px-6 py-12 text-center shadow-sm md:px-16">
        <h2 className="font-display text-3xl md:text-4xl">Healthy eating doesn’t have to be complicated.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Start with a category, search an ingredient you already have, or save a handful of recipes you
          actually want to cook this week.
        </p>
        <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl bg-cream px-5 py-6">
              <h3 className="font-semibold text-ink">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted">{benefit.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
