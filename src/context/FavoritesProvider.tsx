/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Recipe } from '../types/recipe'

const STORAGE_KEY = 'healthy-recipes.favorites'

function loadFavorites(): Recipe[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Recipe[]
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item?.id === 'number') : []
  } catch {
    return []
  }
}

function saveFavorites(favorites: Recipe[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export type FavoritesContextValue = {
  favorites: Recipe[]
  isFavorite: (id: number) => boolean
  addFavorite: (recipe: Recipe) => void
  removeFavorite: (id: number) => void
  toggleFavorite: (recipe: Recipe) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>(loadFavorites)

  const persist = useCallback((next: Recipe[]) => {
    setFavorites(next)
    saveFavorites(next)
  }, [])

  const isFavorite = useCallback((id: number) => favorites.some((item) => item.id === id), [favorites])

  const addFavorite = useCallback(
    (recipe: Recipe) => {
      persist(favorites.some((item) => item.id === recipe.id) ? favorites : [recipe, ...favorites])
    },
    [favorites, persist],
  )

  const removeFavorite = useCallback(
    (id: number) => {
      persist(favorites.filter((item) => item.id !== id))
    },
    [favorites, persist],
  )

  const toggleFavorite = useCallback(
    (recipe: Recipe) => {
      persist(
        favorites.some((item) => item.id === recipe.id)
          ? favorites.filter((item) => item.id !== recipe.id)
          : [recipe, ...favorites],
      )
    },
    [favorites, persist],
  )

  const value = useMemo(
    () => ({ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
