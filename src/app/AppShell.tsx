import { GithubLogo, List as MenuIcon, MagnifyingGlass, X } from '@phosphor-icons/react'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AtlasMark } from '../components/AtlasMark'
import { SearchDialog } from '../components/SearchDialog'
import { StageToggle, ThemeToggle } from '../components/ThemeToggle'
import { Link, navigate, usePathname } from './router'
import styles from './AppShell.module.css'

export const navItems = [
  { to: '/universe', label: 'Universe', match: ['/universe'] },
  { to: '/library', label: 'Library', match: ['/library'] },
  { to: '/crosswalk', label: 'Crosswalk', match: ['/crosswalk'] },
  { to: '/horizon', label: 'Horizon', match: ['/horizon'] },
  { to: '/questions', label: 'Questions', match: ['/questions'] },
  { to: '/cases', label: 'Use cases', match: ['/cases'] },
  { to: '/methodology', label: 'Methodology', match: ['/methodology'] },
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
  useEffect(() => setMenuOpen(false), [pathname])
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
    <div className={styles.shell} data-route={pathname}>
      <header className={styles.bar}>
        <Link to="/" className={styles.brand} aria-label="AI Trust Atlas home">
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
          <StageToggle />
          <ThemeToggle />
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
