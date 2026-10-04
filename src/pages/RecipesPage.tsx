import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '../components/Seo'
import { Pagination } from '../components/Pagination'
import { RecipeGrid } from '../components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '../components/skeletons/RecipeSkeletons'
import { EmptyState, ErrorState } from '../components/states/Feedback'
import { friendlyApiMessage } from '../lib/friendlyApiMessage'
import { SearchBar } from '../components/SearchBar'
import { queryKeys, STALE_TIME } from '../lib/queryKeys'
import { searchRecipes } from '../services/recipeService'
import type { RecipeSearchParams } from '../types/recipe'

const mealTypes = [
  { value: 'breakfast', labelKey: 'filters.meals.breakfast' },
  { value: 'lunch', labelKey: 'filters.meals.lunch' },
  { value: 'dinner', labelKey: 'filters.meals.dinner' },
  { value: 'dessert', labelKey: 'filters.meals.dessert' },
  { value: 'snack', labelKey: 'filters.meals.snack' },
  { value: 'salad', labelKey: 'filters.meals.salad' },
  { value: 'soup', labelKey: 'filters.meals.soup' },
  { value: 'appetizer', labelKey: 'filters.meals.appetizer' },
] as const

const diets = [
  { value: 'vegetarian', labelKey: 'filters.diets.vegetarian' },
  { value: 'vegan', labelKey: 'filters.diets.vegan' },
  { value: 'pescetarian', labelKey: 'filters.diets.pescetarian' },
  { value: 'ketogenic', labelKey: 'filters.diets.ketogenic' },
  { value: 'paleo', labelKey: 'filters.diets.paleo' },
  { value: 'whole30', labelKey: 'filters.diets.whole30' },
  { value: 'gluten free', labelKey: 'filters.diets.glutenFree' },
] as const

const cuisines = [
  { value: 'American', labelKey: 'filters.cuisines.american' },
  { value: 'Italian', labelKey: 'filters.cuisines.italian' },
  { value: 'Mexican', labelKey: 'filters.cuisines.mexican' },
  { value: 'Mediterranean', labelKey: 'filters.cuisines.mediterranean' },
  { value: 'Indian', labelKey: 'filters.cuisines.indian' },
  { value: 'Chinese', labelKey: 'filters.cuisines.chinese' },
  { value: 'Japanese', labelKey: 'filters.cuisines.japanese' },
  { value: 'Thai', labelKey: 'filters.cuisines.thai' },
  { value: 'French', labelKey: 'filters.cuisines.french' },
  { value: 'Middle Eastern', labelKey: 'filters.cuisines.middleEastern' },
] as const

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
  const { t } = useTranslation()
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
      <Seo title={t('recipes.seoTitle')} description={t('recipes.seoDescription')} />
      <h1 className="font-display text-4xl">{t('recipes.title')}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t('recipes.lead')}</p>
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
        <SelectField label={t('filters.mealType')} {...form.register('mealType')} options={mealTypes} />
        <SelectField label={t('filters.diet')} {...form.register('diet')} options={diets} />
        <SelectField label={t('filters.cuisine')} {...form.register('cuisine')} options={cuisines} />
        <NumberField label={t('filters.maxCalories')} {...form.register('maxCalories')} />
        <NumberField label={t('filters.minProtein')} {...form.register('minProtein')} />
        <NumberField label={t('filters.maxCarbs')} {...form.register('maxCarbs')} />
        <NumberField label={t('filters.maxFat')} {...form.register('maxFat')} />
        <NumberField label={t('filters.maxReadyTime')} {...form.register('maxReadyTime')} />
        <div className="md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {t('filters.apply')}
          </button>
        </div>
      </form>

      <div className="mt-8">
        {recipes.isLoading ? <RecipeGridSkeleton /> : null}
        {recipes.isError ? (
          <ErrorState
            title={t('recipes.errorTitle')}
            message={friendlyApiMessage(recipes.error, 'errors.recipesFallback')}
          />
        ) : null}
        {recipes.data && recipes.data.results.length === 0 ? (
          <EmptyState title={t('recipes.emptyTitle')} message={t('recipes.emptyMessage')} />
        ) : null}
        {recipes.data && recipes.data.results.length > 0 ? (
          <>
            <RecipeGrid recipes={recipes.data.results} />
            <Pagination
              page={page}
              totalPages={totalPages}
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
  options: readonly { value: string; labelKey: string }[]
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const { t } = useTranslation()
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <select
        {...props}
        className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-cream px-3 text-sm text-ink"
      >
        <option value="">{t('filters.any')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
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
