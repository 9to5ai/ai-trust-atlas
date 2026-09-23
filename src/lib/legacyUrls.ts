/*
 * Shared links from before the multi-page Atlas used the site root with query
 * parameters and a #/kind/id hash. Map them onto the current routes.
 */
const legacyParams = ['view', 'mode', 'q', 'type', 'region', 'year', 'anchor', 'useCases', 'incidents']

export function legacyRedirect(url: URL): string | null {
  if (url.pathname !== '/' && url.pathname !== '/index.html') return null
  const hasLegacyParams = legacyParams.some((key) => url.searchParams.has(key))
  const hasLegacyHash = url.hash.startsWith('#/')
  if (!hasLegacyParams && !hasLegacyHash) return null
  const params = new URLSearchParams(url.searchParams)
  const view = params.get('view')
  let path = '/universe'
  if (view === 'questions') path = '/questions'
  if (view === 'use-cases') path = '/cases'
  if (view === 'questions' || view === 'use-cases') params.delete('view')
  const search = params.toString()
  return `${path}${search ? `?${search}` : ''}${url.hash}`
}
