import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

/*
 * A deliberately small router: pathname-based routes on the History API.
 * navigate() emits a popstate event so views that restore state from the URL
 * (the Universe workspace) react to in-app links the same way as to Back/Forward.
 */
const subscribe = (notify: () => void) => {
  window.addEventListener('popstate', notify)
  return () => window.removeEventListener('popstate', notify)
}
const snapshot = () => window.location.pathname

export function usePathname() {
  return useSyncExternalStore(subscribe, snapshot, () => '/')
}

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  const current = window.location.pathname + window.location.search + window.location.hash
  if (to === current) return
  const leavingPage = new URL(to, window.location.origin).pathname !== window.location.pathname
  window.history[replace ? 'replaceState' : 'pushState'](null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  if (leavingPage && document.scrollingElement && document.scrollingElement.scrollTop > 0) window.scrollTo({ top: 0 })
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; replace?: boolean }

export function Link({ to, replace, onClick, ...props }: LinkProps) {
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return
    event.preventDefault()
    navigate(to, { replace })
  }
  return <a href={to} onClick={handle} {...props} />
}
