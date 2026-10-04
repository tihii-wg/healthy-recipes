import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleRecipeApi } from '../../server/handleRecipeApi'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url ?? '/api/recipes/random', 'http://localhost')
  const result = await handleRecipeApi(req.method ?? 'GET', '/api/recipes/random', url.searchParams)
  res.status(result.status).json(result.body)
}
