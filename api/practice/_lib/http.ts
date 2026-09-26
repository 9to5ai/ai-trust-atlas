import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { access, accessConfigured } from './auth'
import { checkRateLimit, clientAddress, hashClient, type Env } from './guard'

/* Shared response helpers. Every gated response is private, uncached and kept out of search indexes. */
export const privateHeaders = { 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' }

export function json(status: number, body: unknown, headers: Record<string, string> | [string, string][] = {}) {
  const result = new Headers({ ...privateHeaders, 'content-type': 'application/json; charset=utf-8' })
  for (const [key, value] of Array.isArray(headers) ? headers : Object.entries(headers)) result.append(key, value)
  return new Response(JSON.stringify(body), { status, headers: result })
}

export function file(body: string | Uint8Array, contentType: string) {
  return new Response(typeof body === 'string' ? body : new Uint8Array(body), { status: 200, headers: { ...privateHeaders, 'content-type': contentType } })
}

/*
 * Runs a handler only for callers with a valid session or agent key. Agent-key callers are
 * rate-limited per key; request bodies are never logged.
 */
export async function gated(request: Request, env: Env, handler: (via: 'session' | 'agent-key') => Response | Promise<Response>) {
  if (!accessConfigured(env)) return json(503, { error: 'AI Trust Practice access is not configured.' })
  const granted = access(env, request)
  if (!granted) return json(401, { error: 'Enter the practice password, or send a valid X-Practice-Key header.' })
  if (granted.via === 'agent-key') {
    const limit = await checkRateLimit(env, 'agent', hashClient(`${clientAddress(request)}`), { perMinute: Number(env.PRACTICE_AGENT_PER_MINUTE ?? 60), perDay: Number(env.PRACTICE_AGENT_PER_DAY ?? 3000) })
    if (!limit.ok) return json(429, { error: 'Rate limit reached. Please slow down.' }, { 'retry-after': String(limit.retryAfter) })
  }
  return handler(granted.via)
}

/* The compiled practice build, bundled with each function through vercel.json includeFiles. */
const buildDir = () => join(process.cwd(), '.practice-build')
const cache = new Map<string, Buffer>()
export function readBuild(path: string): Buffer | undefined {
  if (cache.has(path)) return cache.get(path)
  const full = join(buildDir(), path)
  if (!existsSync(full)) return undefined
  const content = readFileSync(full)
  if (process.env.NODE_ENV === 'production') cache.set(path, content)
  return content
}
