# Healthy Recipes

A polished healthy-food recipe app. The browser talks only to this app’s API. Spoonacular stays on the server.

## Stack

React, Vite, TypeScript, Tailwind CSS, TanStack React Query, React Router, React Hook Form, Zod. Recipe data from Spoonacular via Vercel API functions.

## Local setup

```bash
cp .env.example .env
```

Set `SPOONACULAR_API_KEY` in `.env` (server-only — never `VITE_*`). Then:

```bash
npm install
npm run dev
```

Without a key, the UI still runs. Recipe requests return a friendly “temporarily unavailable” state.

## Production (Vercel)

1. Import the repo into Vercel.
2. Add environment variable `SPOONACULAR_API_KEY` (no `VITE_` prefix).
3. Deploy. SPA routes rewrite to `index.html`; `/api/*` stays on serverless functions.

## Architecture

`Browser → React → /api/recipes/* → Spoonacular`

- `src/services/recipeService.ts` is the only UI data layer: `searchRecipes`, `getRecipeDetails`, `getRandomRecipes`, `getRecipesByCategory`.
- Own types live in `src/types/recipe.ts`. `mapSpoonacularRecipe()` adapts provider JSON.
- Proxy routes: `/api/recipes/search`, `/api/recipes/:id`, `/api/recipes/random`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/recipes` | Discover + filters |
| `/recipes/:id` | Details |
| `/search` | Search |
| `/category/:category` | Category |
| `/favorites` | Favorites in `localStorage` |

No authentication. Favorites never leave the browser.
