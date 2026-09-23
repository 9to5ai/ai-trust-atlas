import { createHash } from 'node:crypto'
import type { Turn } from './prompt'

/*
 * Input validation, rate limiting and a daily token budget. With Upstash Redis
 * configured (UPSTASH_REDIS_REST_URL / _TOKEN) limits are shared across
 * instances; otherwise they fall back to best-effort per-instance memory.
 */
type Env = Record<string, string | undefined>
export type AskInput = { question: string; history: Turn[] }

const clean = (text: string) => text.normalize('NFKC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim()

export function validateInput(body: unknown): AskInput | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Send a JSON body with a question.' }
  const { question, history } = body as { question?: unknown; history?: unknown }
  if (typeof question !== 'string' || !clean(question)) return { error: 'Ask a question.' }
  if (clean(question).length > 1000) return { error: 'Please keep questions under 1,000 characters.' }
  const turns = Array.isArray(history) ? history : []
  const parsed: Turn[] = turns.slice(-6).flatMap((turn) => {
    if (!turn || typeof turn !== 'object') return []
    const { role, text } = turn as { role?: unknown; text?: unknown }
    return (role === 'user' || role === 'model') && typeof text === 'string' && text.trim() ? [{ role, text: clean(text).slice(0, 2000) }] : []
  })
  return { question: clean(question), history: parsed }
}

export const hashIp = (ip: string) => createHash('sha256').update(`atlas:${ip}`).digest('hex').slice(0, 12)

const memory = new Map<string, { count: number; expires: number }>()
function memoryIncrement(key: string, by: number, ttlSeconds: number) {
  const now = Date.now()
  const entry = memory.get(key)
  if (!entry || entry.expires < now) { memory.set(key, { count: by, expires: now + ttlSeconds * 1000 }); return by }
  entry.count += by
  return entry.count
}

async function redisIncrement(env: Env, key: string, by: number, ttlSeconds: number) {
  const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([['INCRBY', key, String(by)], ['EXPIRE', key, String(ttlSeconds), 'NX']]),
  })
  if (!response.ok) throw new Error(`Rate store unavailable (${response.status})`)
  const [first] = (await response.json()) as { result: number }[]
  return first.result
}

export async function increment(env: Env, key: string, by: number, ttlSeconds: number) {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    try { return await redisIncrement(env, key, by, ttlSeconds) } catch { /* fall back to memory */ }
  }
  return memoryIncrement(key, by, ttlSeconds)
}

export async function checkRateLimit(env: Env, client: string, now = new Date()) {
  const perMinute = Number(env.ASK_LIMIT_PER_MINUTE ?? 8)
  const perDay = Number(env.ASK_LIMIT_PER_DAY ?? 60)
  const minute = await increment(env, `ask:rl:m:${client}:${Math.floor(now.getTime() / 60000)}`, 1, 70)
  if (minute > perMinute) return { ok: false as const, reason: 'Too many questions in a minute. Please pause for a moment.' }
  const day = await increment(env, `ask:rl:d:${client}:${now.toISOString().slice(0, 10)}`, 1, 90000)
  if (day > perDay) return { ok: false as const, reason: 'Daily question limit reached for this connection.' }
  return { ok: true as const }
}

export async function budgetRemaining(env: Env, now = new Date()) {
  const budget = Number(env.ASK_DAILY_TOKEN_BUDGET ?? 2_000_000)
  const used = await increment(env, `ask:tokens:${now.toISOString().slice(0, 10)}`, 0, 90000)
  return budget - used
}

export const recordUsage = (env: Env, tokens: number, now = new Date()) => increment(env, `ask:tokens:${now.toISOString().slice(0, 10)}`, tokens, 90000)

export const resetGuardMemory = () => memory.clear()
