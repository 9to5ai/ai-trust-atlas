import { developments } from './developments'
import { incidents } from './incidents'
import { useCases } from './useCases'

/*
 * The most recent editorial review across the briefing collections. Rolling
 * windows ("last 30 days") are anchored to whichever is earlier: today or this
 * date, so a quiet period between refreshes never empties the briefing.
 */
const isoDate = /^\d{4}-\d{2}-\d{2}$/
export const latestReview = [
  ...developments.map((item) => item.reviewed),
  ...incidents.map((item) => item.reviewed),
  ...useCases.map((item) => item.reviewed),
].filter((date): date is string => typeof date === 'string' && isoDate.test(date)).sort().at(-1)!

export const briefingAnchor = (today = new Date().toISOString().slice(0, 10)) => (today < latestReview ? today : latestReview)
