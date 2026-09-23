import { Moon, ProjectorScreen, Sun } from '@phosphor-icons/react'
import { useEffect, useLayoutEffect, useState } from 'react'

/* Observatory (dark) is the default; Paper (light) is saved only when chosen. */
export const themeColors = { dark: '#05080f', light: '#f5f3ec' } as const
const readStored = (key: string) => { try { return localStorage.getItem(key) } catch { return null } }
const store = (key: string, value: string) => { try { localStorage.setItem(key, value) } catch { /* Preferences still apply for this visit. */ } }

export function ThemeToggle() {
  const [dark, setDark] = useState(() => readStored('atlas-theme') !== 'light')
  useLayoutEffect(() => {
    const theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
    store('atlas-theme', theme)
  }, [dark])
  return <button className="theme-toggle" type="button" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Paper theme' : 'Observatory theme'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
}

/* Stage mode enlarges type and quiets secondary chrome for projectors and screen shares. */
export function StageToggle() {
  const [stage, setStage] = useState(() => readStored('atlas-stage') === '1')
  useLayoutEffect(() => {
    if (stage) document.documentElement.dataset.stage = ''
    else delete document.documentElement.dataset.stage
    store('atlas-stage', stage ? '1' : '0')
  }, [stage])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 's' || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      setStage((value) => !value)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  return <button className="stage-toggle" type="button" aria-pressed={stage} onClick={() => setStage((value) => !value)} aria-label={stage ? 'Leave stage mode' : 'Enter stage mode'} title="Stage mode (S)"><ProjectorScreen size={18} /></button>
}
