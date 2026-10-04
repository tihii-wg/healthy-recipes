import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleRecipeApi } from '../../server/handleRecipeApi'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  const url = new URL(req.url ?? `/api/recipes/${id ?? ''}`, 'http://localhost')
  const result = await handleRecipeApi(
    req.method ?? 'GET',
    `/api/recipes/${id ?? ''}`,
    url.searchParams,
  )
  res.status(result.status).json(result.body)
}
