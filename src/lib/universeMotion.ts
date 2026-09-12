export type Presence<T> = { value: T; opacity: number; present: boolean }
export function reconcilePresence<T extends { id: string }>(previous: Map<string, Presence<T>>, values: T[]) {
  const next = new Map([...previous].map(([id, entry]) => [id, { ...entry, present: false }]))
  for (const value of values) next.set(value.id, { value, opacity: previous.get(value.id)?.opacity ?? 0, present: true })
  return next
}
export function advancePresence<T>(entries: Map<string, Presence<T>>, delta: number, immediate: boolean) {
  const step = Math.max(0, Math.min(delta, 50)) / 360
  for (const [id, entry] of entries) {
    entry.opacity = immediate ? Number(entry.present) : Math.max(0, Math.min(1, entry.opacity + (entry.present ? step : -step)))
    if (!entry.present && entry.opacity === 0) entries.delete(id)
  }
}
export function motionStep(delta: number, paused: boolean, reduced: boolean, hidden: boolean, engaged: boolean) {
  const detail = paused || reduced || hidden ? 0 : Math.max(0, Math.min(delta, 50))
  return { detail, ambient: engaged ? 0 : detail }
}
