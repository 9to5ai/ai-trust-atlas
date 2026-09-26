import { checkPassword, createSession, sessionCookies } from './_lib/auth'
import { checkRateLimit, clientAddress, hashClient, type Env } from './_lib/guard'
import { json } from './_lib/http'

/* POST /api/practice/login — checks the shared password and sets a signed 30-day session cookie. */
export async function handleLogin(request: Request, env: Env = process.env) {
  if (!request.headers.get('content-type')?.includes('application/json')) return json(415, { error: 'Send JSON.' })
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { error: 'Cross-site request refused.' })
  const limit = await checkRateLimit(env, 'login', hashClient(clientAddress(request)), { perMinute: 5, perDay: 30 })
  if (!limit.ok) return json(429, { error: 'Too many attempts. Please wait and try again.' }, { 'retry-after': String(limit.retryAfter) })
  let body: { password?: unknown }
  try { body = await request.json() } catch { return json(400, { error: 'Send JSON.' }) }
  if (!checkPassword(env, body.password)) return json(401, { error: 'That password is not right.' })
  return json(200, { ok: true }, sessionCookies(createSession(env)).map((cookie) => ['set-cookie', cookie] as [string, string]))
}

export const POST = (request: Request) => handleLogin(request)
