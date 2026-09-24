import { useSyncExternalStore } from 'react'

/* Presenting mode: the Universe fills the screen for projectors and screen shares. Not persisted across visits. */
let presenting = false
const listeners = new Set<() => void>()

export const isPresenting = () => presenting

export function setPresenting(next: boolean) {
  if (next === presenting) return
  presenting = next
  const root = document.documentElement
  if (next) root.dataset.stage = ''
  else delete root.dataset.stage
  // Fullscreen is best effort: browsers refuse it without a user gesture, and presenting still works in the window.
  if (next && !document.fullscreenElement) root.requestFullscreen?.().catch(() => undefined)
  if (!next && document.fullscreenElement) document.exitFullscreen?.().catch(() => undefined)
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export const usePresenting = () => useSyncExternalStore(subscribe, isPresenting, () => false)
