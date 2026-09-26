import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { Env } from './guard'

/*
 * Access to AI Trust Practice: one shared password for people (a signed session cookie) and a
 * separate shared key for agents (a request header). The signing key mixes the session secret
 * with a hash of the current password, so rotating the password ends every existing session.
 * Missing configuration fails closed.
 */
export const SESSION_COOKIE = 'atp_session'
/* Not a secret: tells the public Atlas UI that asking for practice markers is worthwhile. */
export const HINT_COOKIE = 'atp_hint'
export const SESSION_DAYS = 30

const sha256 = (value: string) => createHash('sha256').update(value).digest()
const safeEqual = (a: string, b: string) => timingSafeEqual(sha256(a), sha256(b))

export function accessConfigured(env: Env) {
  return !!env.PRACTICE_PASSWORD && !!env.PRACTICE_SESSION_SECRET && env.PRACTICE_SESSION_SECRET.length >= 32
}

const signingKey = (env: Env) => sha256(`${env.PRACTICE_SESSION_SECRET}\0${env.PRACTICE_PASSWORD}`)
const sign = (env: Env, payload: string) => createHmac('sha256', signingKey(env)).update(payload).digest('base64url')

export function checkPassword(env: Env, password: unknown) {
  return accessConfigured(env) && typeof password === 'string' && password.length <= 200 && safeEqual(password, env.PRACTICE_PASSWORD!)
}

export function createSession(env: Env, now = Date.now()) {
  const expires = now + SESSION_DAYS * 86_400_000
  const payload = `v1.${Math.floor(expires / 1000)}`
  return `${payload}.${sign(env, payload)}`
}

export function verifySession(env: Env, token: string | undefined, now = Date.now()) {
  if (!accessConfigured(env) || !token) return false
  const match = /^(v1\.(\d{10}))\.([A-Za-z0-9_-]{43})$/.exec(token)
  if (!match) return false
  if (Number(match[2]) * 1000 < now) return false
  return safeEqual(match[3], sign(env, match[1]))
}

export function checkAgentKey(env: Env, request: Request) {
  const configured = env.PRACTICE_AGENT_KEY
  if (!configured || configured.length < 24) return false
  const header = request.headers.get('x-practice-key') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  return !!header && safeEqual(header, configured)
}

export function readCookie(request: Request, name: string) {
  for (const part of (request.headers.get('cookie') ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return rest.join('=')
  }
  return undefined
}

export type Access = { via: 'session' | 'agent-key' }
export function access(env: Env, request: Request): Access | undefined {
  if (verifySession(env, readCookie(request, SESSION_COOKIE))) return { via: 'session' }
  if (checkAgentKey(env, request)) return { via: 'agent-key' }
  return undefined
}

export function sessionCookies(token: string) {
  const maxAge = SESSION_DAYS * 86_400
  return [
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
    `${HINT_COOKIE}=1; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax`,
  ]
}
export const clearedCookies = () => [
  `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  `${HINT_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`,
]
