import { defineConfig, loadEnv, type PreviewServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
import { handleRecipeApi } from './server/handleRecipeApi'

function attachRecipeApi(
  server: ViteDevServer | PreviewServer,
  env: Record<string, string>,
) {
  if (env.SPOONACULAR_API_KEY && !process.env.SPOONACULAR_API_KEY) {
    process.env.SPOONACULAR_API_KEY = env.SPOONACULAR_API_KEY
  }

  server.middlewares.use((req, res, next) => {
    const url = req.url ?? ''
    if (!url.startsWith('/api/recipes')) {
      next()
      return
    }

    void (async () => {
      try {
        const parsed = new URL(url, 'http://localhost')
        const result = await handleRecipeApi(
          req.method ?? 'GET',
          parsed.pathname,
          parsed.searchParams,
        )
        res.statusCode = result.status
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(result.body))
      } catch {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'unavailable', message: 'Something went wrong. Please try again.' }))
      }
    })()
  })
}

function recipeApiPlugin(env: Record<string, string>) {
  return {
    name: 'local-recipe-api',
    configureServer(server: ViteDevServer) {
      attachRecipeApi(server, env)
    },
    configurePreviewServer(server: PreviewServer) {
      attachRecipeApi(server, env)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), recipeApiPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})
