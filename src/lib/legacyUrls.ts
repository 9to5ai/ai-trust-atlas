/*
 * The site root opens the Universe. Shared links from before the multi-page
 * Atlas used the root with query parameters and a #/kind/id hash; they keep
 * working because the Universe reads the same parameters. Retired pages
 * (Library, source pages, Compare, Ask, Methodology) open the Universe, with a
 * source page landing on that source.
 */
export function legacyRedirect(url: URL): string | null {
  const source = url.pathname.match(/^\/library\/([a-z0-9-]+)$/)
  if (source && source[1] !== 'compare') return `/universe#/instrument/${source[1]}`
  if (/^\/(library|library\/compare|ask|methodology)\/?$/.test(url.pathname)) return '/universe'
  if (url.pathname !== '/' && url.pathname !== '/index.html') return null
  const params = new URLSearchParams(url.searchParams)
  const view = params.get('view')
  let path = '/universe'
  if (view === 'questions') path = '/questions'
  if (view === 'use-cases') path = '/cases'
  if (view === 'questions' || view === 'use-cases') params.delete('view')
  const search = params.toString()
  return `${path}${search ? `?${search}` : ''}${url.hash}`
}
