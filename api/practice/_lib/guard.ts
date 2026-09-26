import { createHash } from 'node:crypto'

/*
 * Rate limiting for the practice gate and agent interface. With Upstash Redis configured
 * (UPSTASH_REDIS_REST_URL / _TOKEN) limits are shared across instances; otherwise they fall
 * back to best-effort per-instance memory. Keys hold hashes, never raw IPs or agent keys.
 */
export type Env = Record<string, string | undefined>

export const hashClient = (value: string) => createHash('sha256').update(`atp:${value}`).digest('hex').slice(0, 16)
export const clientAddress = (request: Request) => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'

const memory = new Map<string, { count: number; expires: number }>()
function memoryIncrement(key: string, ttlSeconds: number) {
  const now = Date.now()
  const entry = memory.get(key)
  if (!entry || entry.expires < now) { memory.set(key, { count: 1, expires: now + ttlSeconds * 1000 }); return 1 }
  entry.count += 1
  return entry.count
}

async function redisIncrement(env: Env, key: string, ttlSeconds: number) {
  const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([['INCR', key], ['EXPIRE', key, String(ttlSeconds), 'NX']]),
  })
  if (!response.ok) throw new Error(`Rate store unavailable (${response.status})`)
  const [first] = (await response.json()) as { result: number }[]
  return first.result
}

async function increment(env: Env, key: string, ttlSeconds: number) {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    try { return await redisIncrement(env, key, ttlSeconds) } catch { /* fall back to memory */ }
  }
  return memoryIncrement(key, ttlSeconds)
}

/* Counts one request against a per-minute and a per-day window. */
export async function checkRateLimit(env: Env, scope: string, client: string, { perMinute, perDay }: { perMinute: number; perDay: number }, now = new Date()) {
  const minute = await increment(env, `atp:${scope}:m:${client}:${Math.floor(now.getTime() / 60000)}`, 70)
  if (minute > perMinute) return { ok: false as const, retryAfter: 60 }
  const day = await increment(env, `atp:${scope}:d:${client}:${now.toISOString().slice(0, 10)}`, 90000)
  if (day > perDay) return { ok: false as const, retryAfter: 3600 }
  return { ok: true as const }
}

export const resetGuardMemory = () => memory.clear()
