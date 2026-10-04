import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '../components/skeletons/RecipeSkeletons'
import { EmptyState, ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { SearchBar } from '../components/SearchBar'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { searchRecipes } from '../services/recipeService'
import type { RecipeSearchParams } from '../types/recipe'

const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'salad', 'soup', 'appetizer']
const diets = ['vegetarian', 'vegan', 'pescetarian', 'ketogenic', 'paleo', 'whole30', 'gluten free']
const cuisines = [
  'American',
  'Italian',
  'Mexican',
  'Mediterranean',
  'Indian',
  'Chinese',
  'Japanese',
  'Thai',
  'French',
  'Middle Eastern',
]

type FilterForm = {
  mealType: string
  diet: string
  cuisine: string
  maxCalories: string
  minProtein: string
  maxCarbs: string
  maxFat: string
  maxReadyTime: string
}

function numberFrom(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function paramsFromSearch(searchParams: URLSearchParams): RecipeSearchParams {
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  return {
    query: searchParams.get('q') ?? undefined,
    mealType: searchParams.get('type') ?? undefined,
    diet: searchParams.get('diet') ?? undefined,
    cuisine: searchParams.get('cuisine') ?? undefined,
    maxCalories: numberFrom(searchParams.get('maxCalories') ?? ''),
    minProtein: numberFrom(searchParams.get('minProtein') ?? ''),
    maxCarbs: numberFrom(searchParams.get('maxCarbs') ?? ''),
    maxFat: numberFrom(searchParams.get('maxFat') ?? ''),
    maxReadyTime: numberFrom(searchParams.get('maxReadyTime') ?? ''),
    number: 12,
    offset: (page - 1) * 12,
  }
}

export function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = paramsFromSearch(searchParams)
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)

  const form = useForm<FilterForm>({
    defaultValues: {
      mealType: searchParams.get('type') ?? '',
      diet: searchParams.get('diet') ?? '',
      cuisine: searchParams.get('cuisine') ?? '',
      maxCalories: searchParams.get('maxCalories') ?? '',
      minProtein: searchParams.get('minProtein') ?? '',
      maxCarbs: searchParams.get('maxCarbs') ?? '',
      maxFat: searchParams.get('maxFat') ?? '',
      maxReadyTime: searchParams.get('maxReadyTime') ?? '',
    },
  })

  const recipes = useQuery({
    queryKey: queryKeys.search(filters),
    queryFn: () => searchRecipes(filters),
    staleTime: STALE_TIME.search,
  })

  function applyFilters(values: FilterForm) {
    const next = new URLSearchParams(searchParams)
    const mapping: Record<keyof FilterForm, string> = {
      mealType: 'type',
      diet: 'diet',
      cuisine: 'cuisine',
      maxCalories: 'maxCalories',
      minProtein: 'minProtein',
      maxCarbs: 'maxCarbs',
      maxFat: 'maxFat',
      maxReadyTime: 'maxReadyTime',
    }
    for (const [formKey, urlKey] of Object.entries(mapping) as [keyof FilterForm, string][]) {
      const value = values[formKey].trim()
      if (value) next.set(urlKey, value)
      else next.delete(urlKey)
    }
    next.delete('page')
    setSearchParams(next)
  }

  const totalPages = recipes.data
    ? Math.max(1, Math.ceil(recipes.data.totalResults / (recipes.data.number || 12)))
    : 1

  return (
    <>
      <Seo
        title="Discover recipes — Healthy Recipes"
        description="Browse healthy recipes and filter by meal type, diet, cuisine, calories, protein, carbs, fat, and prep time."
      />
      <h1 className="font-display text-4xl">Discover recipes</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Search by dish or ingredient, then narrow with the filters Spoonacular actually supports.
      </p>
      <div className="mt-6 max-w-2xl">
        <SearchBar
          initialQuery={searchParams.get('q') ?? ''}
          onSearch={(query) => {
            const next = new URLSearchParams(searchParams)
            if (query) next.set('q', query)
            else next.delete('q')
            next.delete('page')
            setSearchParams(next)
          }}
        />
      </div>

      <form
        onSubmit={form.handleSubmit(applyFilters)}
        className="mt-6 grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-100 md:grid-cols-4"
      >
        <SelectField label="Meal type" {...form.register('mealType')} options={mealTypes} />
        <SelectField label="Diet" {...form.register('diet')} options={diets} />
        <SelectField label="Cuisine" {...form.register('cuisine')} options={cuisines} />
        <NumberField label="Max calories" {...form.register('maxCalories')} />
        <NumberField label="Min protein (g)" {...form.register('minProtein')} />
        <NumberField label="Max carbs (g)" {...form.register('maxCarbs')} />
        <NumberField label="Max fat (g)" {...form.register('maxFat')} />
        <NumberField label="Max prep time (min)" {...form.register('maxReadyTime')} />
        <div className="md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Apply filters
          </button>
        </div>
      </form>

      <div className="mt-8">
        {recipes.isLoading ? <RecipeGridSkeleton /> : null}
        {recipes.isError ? (
          <ErrorState
            title="Recipes could not be loaded"
            message={friendlyApiMessage(recipes.error, 'Please try again in a little while.')}
          />
        ) : null}
        {recipes.data && recipes.data.results.length === 0 ? (
          <EmptyState
            title="No recipes match these filters"
            message="Try a broader search or clear a filter or two."
          />
        ) : null}
        {recipes.data && recipes.data.results.length > 0 ? (
          <>
            <RecipeGrid recipes={recipes.data.results} />
            <Pagination
              page={page}
              totalPages={Math.min(totalPages, 50)}
              onChange={(nextPage) => {
                const next = new URLSearchParams(searchParams)
                next.set('page', String(nextPage))
                setSearchParams(next)
              }}
            />
          </>
        ) : null}
      </div>
    </>
  )
}

function SelectField({
  label,
  options,
  ...props
}: {
  label: string
  options: string[]
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <select
        {...props}
        className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-cream px-3 text-sm text-ink"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function NumberField({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <input
        type="number"
        min={0}
        {...props}
        className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-cream px-3 text-sm text-ink"
      />
    </label>
  )
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-full border border-stone-200 px-4 py-2 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      <p className="text-sm text-muted">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-full border border-stone-200 px-4 py-2 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
