import { GithubLogo, List as MenuIcon, MagnifyingGlass, ProjectorScreen, X } from '@phosphor-icons/react'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AtlasMark } from '../components/AtlasMark'
import { SearchDialog } from '../components/SearchDialog'
import { isPresenting, setPresenting, usePresenting } from './presenting'
import { Link, navigate, usePathname } from './router'
import { metaFor } from './pageMeta'
import styles from './AppShell.module.css'

export const navItems = [
  { to: '/universe', label: 'Universe', match: ['/universe'] },
  { to: '/questions', label: 'Questions', match: ['/questions'] },
  { to: '/cases', label: 'Use cases', match: ['/cases'] },
] as const

/* Routes that own search and time controls render them into the header through this slot. */
const RouteActionsSlot = createContext<HTMLElement | null>(null)
export function RouteActions({ children }: { children: ReactNode }) {
  const slot = useContext(RouteActionsSlot)
  return slot ? createPortal(children, slot) : null
}

export const universeRoutes = ['/universe', '/questions', '/cases']
export const openSearchEvent = 'atlas:open-search'
export const openSearch = () => window.dispatchEvent(new Event(openSearchEvent))
export const hashPath = (id: string) => `#/${id.replace(':', '/')}`

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const routeOwnsSearch = universeRoutes.includes(pathname)
  const presenting = usePresenting()
  const present = () => { if (pathname !== '/universe') navigate('/universe'); setPresenting(true) }
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => { document.title = metaFor(pathname).title }, [pathname])
  useEffect(() => {
    // S starts or stops presenting; leaving browser fullscreen also stops it.
    const key = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 's' || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"], dialog[open]')) return
      if (isPresenting()) setPresenting(false)
      else { if (window.location.pathname !== '/universe') navigate('/universe'); setPresenting(true) }
    }
    const fullscreen = () => { if (!document.fullscreenElement) setPresenting(false) }
    window.addEventListener('keydown', key)
    document.addEventListener('fullscreenchange', fullscreen)
    return () => { window.removeEventListener('keydown', key); document.removeEventListener('fullscreenchange', fullscreen) }
  }, [])
  useEffect(() => { if (!universeRoutes.includes(pathname)) setPresenting(false) }, [pathname])
  useEffect(() => {
    if (routeOwnsSearch) return
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen((open) => !open) }
    }
    const open = () => setSearchOpen(true)
    window.addEventListener('keydown', handler)
    window.addEventListener(openSearchEvent, open)
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener(openSearchEvent, open) }
  }, [routeOwnsSearch])

  return (
    <div className={`${styles.shell}${presenting ? ` ${styles.presenting}` : ''}`} data-route={pathname}>
      <header className={styles.bar}>
        <Link to="/universe" className={styles.brand} aria-label="AI Trust Atlas — open the Universe">
          <span className={styles.mark}><AtlasMark size={26} /></span>
          <span className={styles.wordmark}>AI Trust <em>Atlas</em></span>
        </Link>
        <nav className={`${styles.nav}${menuOpen ? ` ${styles.navOpen}` : ''}`} aria-label="Atlas sections" id="atlas-sections">
          {navItems.map((item) => {
            const current = (item.match as readonly string[]).some((match) => pathname === match || pathname.startsWith(`${match}/`))
            return <Link key={item.to} to={item.to} className={styles.navLink} aria-current={current ? 'page' : undefined}>{item.label}</Link>
          })}
        </nav>
        <div className={styles.actions}>
          {!routeOwnsSearch && <button type="button" className={styles.search} onClick={() => setSearchOpen(true)} aria-label="Search everything"><MagnifyingGlass size={16} /><span>Search</span><kbd>⌘K</kbd></button>}
          <div className={styles.routeActions} ref={setSlot} />
          <button type="button" className={styles.present} aria-pressed={presenting} onClick={present} aria-label="Present the Universe" title="Present (S)"><ProjectorScreen size={18} /></button>
          <a className={styles.iconLink} href="https://github.com/9to5ai/ai-trust-atlas" target="_blank" rel="noreferrer" aria-label="Source code on GitHub" title="Source code"><GithubLogo size={18} /></a>
          <button type="button" className={styles.menu} aria-expanded={menuOpen} aria-controls="atlas-sections" aria-label={menuOpen ? 'Close sections menu' : 'Open sections menu'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={18} /> : <MenuIcon size={18} />}</button>
        </div>
      </header>
      <RouteActionsSlot.Provider value={slot}>
        <div className={styles.route}>{children}</div>
      </RouteActionsSlot.Provider>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} onSelect={(id) => { setSearchOpen(false); navigate(`/universe${hashPath(id)}`) }} />}
    </div>
  )
}
