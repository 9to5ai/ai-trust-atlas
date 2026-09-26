import type { Env } from './_lib/guard'
import { file, gated, json, readBuild } from './_lib/http'

/* GET /api/practice/corpus — the full compiled corpus for the web app and agents. */
export function handleCorpus(request: Request, env: Env = process.env) {
  return gated(request, env, () => {
    const corpus = readBuild('corpus.json')
    return corpus ? file(corpus, 'application/json; charset=utf-8') : json(503, { error: 'The practice corpus has not been built.' })
  })
}
export const GET = (request: Request) => handleCorpus(request)
