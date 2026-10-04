export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-stone-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-stone-200" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-100" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-stone-100" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-stone-100" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-stone-100" />
        </div>
      </div>
    </div>
  )
}

export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function RecipeDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="aspect-[16/9] w-full animate-pulse rounded-[2rem] bg-stone-200" />
      <div className="h-10 w-2/3 animate-pulse rounded-full bg-stone-200" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded-full bg-stone-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-stone-100" />
      </div>
      <NutritionSkeleton />
      <IngredientListSkeleton />
    </div>
  )
}

export function NutritionSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-2xl bg-stone-100" />
      ))}
    </div>
  )
}

export function IngredientListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-10 animate-pulse rounded-xl bg-stone-100" />
      ))}
    </div>
  )
}
