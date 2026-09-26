import type { Env } from './_lib/guard'
import { file, gated, readBuild } from './_lib/http'

/* GET /api/practice/atlas-index — Atlas node IDs mapped to the practices that serve them (traversal markers). */
export function handleAtlasIndex(request: Request, env: Env = process.env) {
  return gated(request, env, () => file(readBuild('atlas-index.json') ?? '{}', 'application/json; charset=utf-8'))
}
export const GET = (request: Request) => handleAtlasIndex(request)
