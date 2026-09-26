import { access, accessConfigured } from './_lib/auth.js'
import type { Env } from './_lib/guard.js'
import { json } from './_lib/http.js'

/* GET /api/practice/session — whether this browser has access. Reveals nothing else. */
export function handleSession(request: Request, env: Env = process.env) {
  return json(200, { configured: accessConfigured(env), authenticated: access(env, request)?.via === 'session' })
}
export const GET = (request: Request) => handleSession(request)
