import { timelineEvents, type TimelineEvent } from '../data/timeline'

/* Horizon rings count forward from the reference date. */
export type HorizonRing = 'past' | 'now' | 'near' | 'far'
export const horizonRingLabels: Record<Exclude<HorizonRing, 'past'>, string> = { now: 'Next 6 months', near: '6–18 months', far: 'Beyond 18 months' }

export const eventTime = (event: Pick<TimelineEvent, 'date'>) => Date.parse(event.date.length === 7 ? `${event.date}-01T00:00:00Z` : event.date.length === 4 ? `${event.date}-01-01T00:00:00Z` : `${event.date}T00:00:00Z`)
const monthsBetween = (from: number, to: number) => (to - from) / (1000 * 60 * 60 * 24 * 30.4375)

export function horizonRing(event: TimelineEvent, today: string): HorizonRing {
  const months = monthsBetween(Date.parse(`${today}T00:00:00Z`), eventTime(event))
  if (months < 0) return 'past'
  if (months <= 6) return 'now'
  if (months <= 18) return 'near'
  return 'far'
}

/* Forward-looking obligations and expected publications, nearest first. */
export function upcomingEvents(today: string, events = timelineEvents) {
  return events.filter((event) => event.kind !== 'published' && event.kind !== 'development' && horizonRing(event, today) !== 'past').sort((a, b) => eventTime(a) - eventTime(b))
}

/* Recent history: publications, commencements and developments in the trailing window. */
export function recentEvents(today: string, months = 12, events = timelineEvents) {
  const now = Date.parse(`${today}T00:00:00Z`)
  return events.filter((event) => { const age = monthsBetween(eventTime(event), now); return age >= 0 && age <= months }).sort((a, b) => eventTime(b) - eventTime(a))
}

export const horizonRegions = ['Australia', 'Europe', 'Global', 'United States', 'United Kingdom', 'Singapore', 'Canada'] as const

export const formatEventDate = (event: Pick<TimelineEvent, 'date' | 'precision'>) => {
  const date = new Date(eventTime(event))
  return date.toLocaleDateString('en-AU', event.precision === 'day' ? { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' } : event.precision === 'month' ? { month: 'short', year: 'numeric', timeZone: 'UTC' } : { year: 'numeric', timeZone: 'UTC' })
}
