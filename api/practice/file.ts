import type { Env } from './_lib/guard.js'
import { file, gated, json, readBuild } from './_lib/http.js'

/*
 * GET /api/practice/file?path=… — the readable layer at stable URLs (see the rewrites in vercel.json):
 * /practice/corpus.json, /practice/llms.txt, /practice/p/DAT-01.md and so on. Only listed paths are served.
 */
const types: Record<string, string> = {
  json: 'application/json; charset=utf-8', md: 'text/markdown; charset=utf-8', txt: 'text/plain; charset=utf-8',
  xml: 'application/rss+xml; charset=utf-8', zip: 'application/zip', sig: 'text/plain; charset=utf-8', '': 'text/plain; charset=utf-8',
}
const allowed = /^(corpus\.json|schema\.json|llms\.txt|llms-full\.txt|changes\.json|changes\.xml|skill\.zip|SHA256SUMS|SHA256SUMS\.sig|practices\/[A-Z]{2,3}-\d{2}\.(?:json|md))$/

export function handleFile(request: Request, env: Env = process.env) {
  return gated(request, env, () => {
    const path = new URL(request.url).searchParams.get('path') ?? ''
    if (!allowed.test(path)) return json(404, { error: 'Not found.' })
    const content = readBuild(path)
    if (!content) return json(404, { error: 'Not found.' })
    const extension = /\.([a-z]+)$/.exec(path)?.[1] ?? ''
    return file(content, types[extension] ?? 'application/octet-stream')
  })
}
export const GET = (request: Request) => handleFile(request)
