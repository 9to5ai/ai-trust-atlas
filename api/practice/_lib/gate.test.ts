// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest'
import { createSession, verifySession } from './auth'
import { resetGuardMemory } from './guard'
import { handleCorpus } from '../corpus'
import { handleFile } from '../file'
import { handleLogin } from '../login'
import { handleSession } from '../session'

const env = { PRACTICE_PASSWORD: 'correct horse battery staple', PRACTICE_SESSION_SECRET: 's'.repeat(40), PRACTICE_AGENT_KEY: 'k'.repeat(32) }
const url = 'https://atlas.example/api/practice'
const login = (password: string, headers: Record<string, string> = {}) =>
  handleLogin(new Request(`${url}/login`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9', ...headers }, body: JSON.stringify({ password }) }), env)
const withCookie = (path: string, cookie: string) => new Request(`${url}/${path}`, { headers: { cookie } })

beforeEach(() => resetGuardMemory())

describe('practice gate', () => {
  it('fails closed when access is not configured', async () => {
    expect((await handleCorpus(new Request(`${url}/corpus`), {})).status).toBe(503)
  })

  it('refuses the wrong password and sets signed cookies for the right one', async () => {
    expect((await login('wrong')).status).toBe(401)
    const response = await login(env.PRACTICE_PASSWORD)
    expect(response.status).toBe(200)
    const cookies = response.headers.getSetCookie()
    expect(cookies[0]).toMatch(/^atp_session=v1\.\d{10}\.[\w-]{43}; .*HttpOnly; Secure; SameSite=Lax/)
    expect(cookies[1]).toMatch(/^atp_hint=1;/)
    const session = await handleSession(withCookie('session', cookies[0].split(';')[0]), env)
    expect(await session.json()).toEqual({ configured: true, authenticated: true })
  })

  it('rate-limits login attempts per client', async () => {
    for (let attempt = 0; attempt < 5; attempt++) await login('wrong')
    expect((await login(env.PRACTICE_PASSWORD)).status).toBe(429)
  })

  it('refuses cross-site login posts and non-JSON bodies', async () => {
    expect((await login(env.PRACTICE_PASSWORD, { origin: 'https://evil.example' })).status).toBe(403)
    expect((await handleLogin(new Request(`${url}/login`, { method: 'POST', body: 'password=x' }), env)).status).toBe(415)
  })

  it('expires sessions and invalidates them when the password rotates', () => {
    const token = createSession(env, Date.parse('2026-09-26'))
    expect(verifySession(env, token, Date.parse('2026-10-01'))).toBe(true)
    expect(verifySession(env, token, Date.parse('2026-11-01'))).toBe(false)
    expect(verifySession({ ...env, PRACTICE_PASSWORD: 'rotated password' }, token, Date.parse('2026-10-01'))).toBe(false)
    expect(verifySession(env, `${token.slice(0, -1)}${token.endsWith('A') ? 'B' : 'A'}`, Date.parse('2026-10-01'))).toBe(false)
  })

  it('serves gated files to a valid agent key only, and only listed paths', async () => {
    const request = (path: string, key?: string) => new Request(`${url}/file?path=${encodeURIComponent(path)}`, { headers: key ? { 'x-practice-key': key } : {} })
    expect((await handleFile(request('corpus.json'), env)).status).toBe(401)
    expect((await handleFile(request('corpus.json', 'wrong-key-wrong-key-wrong-key'), env)).status).toBe(401)
    expect((await handleFile(request('../package.json', env.PRACTICE_AGENT_KEY), env)).status).toBe(404)
    expect((await handleFile(request('canaries.txt', env.PRACTICE_AGENT_KEY), env)).status).toBe(404)
    const allowed = await handleFile(request('schema.json', env.PRACTICE_AGENT_KEY), env)
    expect([200, 404]).toContain(allowed.status)
    expect(allowed.headers.get('cache-control')).toBe('private, no-store')
  })
})
