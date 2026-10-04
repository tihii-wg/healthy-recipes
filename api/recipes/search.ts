import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleRecipeApi } from '../../server/handleRecipeApi.js'
import { getSearchParams } from '../../server/requestParams.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await handleRecipeApi(
      req.method ?? 'GET',
      '/api/recipes/search',
      getSearchParams(req),
    )
    res.status(result.status).json(result.body)
  } catch {
    res
      .status(500)
      .json({ error: 'unavailable', message: 'Something went wrong. Please try again.' })
  }
}
