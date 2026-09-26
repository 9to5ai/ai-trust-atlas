import type { Corpus } from './core/schema'

/* Client for the gated practice API. The corpus is held in memory only and never written to browser storage. */
export type SessionState = { configured: boolean; authenticated: boolean }

export async function getSession(): Promise<SessionState> {
  const response = await fetch('/api/practice/session', { credentials: 'same-origin' })
  if (!response.ok) throw new Error(`Session check failed (${response.status})`)
  return response.json()
}

export async function login(password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch('/api/practice/login', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) })
  if (response.ok) return { ok: true }
  const body = await response.json().catch(() => ({ error: 'Something went wrong. Please try again.' }))
  return { ok: false, error: body.error ?? 'Something went wrong. Please try again.' }
}

export async function logout() {
  await fetch('/api/practice/logout', { method: 'POST', credentials: 'same-origin' })
  corpusPromise = undefined
}

let corpusPromise: Promise<Corpus> | undefined
export function loadCorpus(): Promise<Corpus> {
  corpusPromise ??= fetch('/api/practice/corpus', { credentials: 'same-origin' }).then(async (response) => {
    if (!response.ok) { corpusPromise = undefined; throw new Error(response.status === 401 ? 'locked' : `Could not load the practices (${response.status})`) }
    return response.json() as Promise<Corpus>
  })
  return corpusPromise
}
