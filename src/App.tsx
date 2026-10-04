import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { FavoritesProvider } from './context/FavoritesProvider'
import { HomePage } from './pages/HomePage'
import { RecipesPage } from './pages/RecipesPage'
import { RecipeDetailsPage } from './pages/RecipeDetailsPage'
import { SearchPage } from './pages/SearchPage'
import { CategoryPage } from './pages/CategoryPage'
import { FavoritesPage } from './pages/FavoritesPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </QueryClientProvider>
  )
}
