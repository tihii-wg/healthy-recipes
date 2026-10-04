import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleRecipeApi } from '../../server/handleRecipeApi'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url ?? '/api/recipes/search', 'http://localhost')
  const result = await handleRecipeApi(req.method ?? 'GET', '/api/recipes/search', url.searchParams)
  res.status(result.status).json(result.body)
}
