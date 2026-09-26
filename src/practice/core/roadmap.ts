import type { DomainId, Level } from './facets'
import { domains } from './facets'
import type { AssessmentResult } from './assessment'
import type { Corpus, Practice } from './schema'
import type { Profile } from './workspace'

/*
 * Turns assessment gaps into a sequenced roadmap. The rules are deliberately simple and
 * published, so anyone can see why a practice ranked where it did.
 */
export const DEFAULT_TARGET: Level = 3

export const roadmapRules = [
  'Gap: target level minus current level. Practices not yet assessed count as Ad hoc (level 1). The default target is Operating (level 3).',
  'Priority = gap × risk weight (1–3, set per practice) × relevance, plus deadline, dependency and sector points.',
  'Relevance is 1 when the practice applies to an AI system type you use, and 0.5 when it does not. With no system types in your profile, every practice counts as relevant.',
  'Deadline points apply when an Australian key date falls within 12 months (+1.5) or 6 months (+3), or has passed within the last 12 months (+3), and your profile includes Australia. Dates that only bind some organisations (for example Commonwealth agencies or WA public entities) count only when your profile says they apply.',
  'Dependency points: +0.5 for each other roadmap practice that lists this one as a prerequisite.',
  'Sector points: +1 when the practice has a note for a regulated sector in your profile (for example APRA-regulated entities).',
  'The highest-priority items fill Now (up to 5), then Next (up to 7), then Later. A practice is never scheduled before its prerequisites.',
] as const

export type Bucket = 'now' | 'next' | 'later'
export const bucketOrder: Bucket[] = ['now', 'next', 'later']
export type RoadmapItem = {
  practiceId: string
  title: string
  domain: DomainId
  current?: Level
  target: Level
  gap: number
  priority: number
  bucket: Bucket
  owner: string
  prerequisites: string[]
  reasons: string[]
}
export type RoadmapOptions = {
  corpus: Corpus
  result: AssessmentResult
  targets?: Record<string, Level>
  profile: Profile
  /* YYYY-MM-DD, so results are reproducible. */
  today: string
  capacity?: { now: number; next: number }
}

const DAY = 86_400_000
const round = (value: number) => Math.round(value * 10) / 10
const sectorPatterns: Partial<Record<Profile['regulated'][number], RegExp>> = {
  apra: /apra/i,
  'asic-licensee': /asic|afs|licensee/i,
  'commonwealth-agency': /commonwealth|government agenc/i,
  'state-agency': /state|wa public|nsw|victoria/i,
  health: /health/i,
  'critical-infrastructure': /critical infrastructure|soci/i,
}

export function buildRoadmap({ corpus, result, targets = {}, profile, today, capacity = { now: 5, next: 7 } }: RoadmapOptions): RoadmapItem[] {
  const todayTime = Date.parse(`${today}T00:00:00Z`)
  const inAustralia = profile.jurisdictions.some((jurisdiction) => jurisdiction.startsWith('AU'))
  const candidates = corpus.practices
    .map((practice) => {
      const current = result.practices[practice.id]?.level
      const target = targets[practice.id] ?? DEFAULT_TARGET
      return { practice, current, target, gap: target - (current ?? 1) }
    })
    .filter((entry) => entry.gap > 0)
  const onRoadmap = new Set(candidates.map((entry) => entry.practice.id))

  const items: RoadmapItem[] = candidates.map(({ practice, current, target, gap }) => {
    const reasons: string[] = []
    reasons.push(current === undefined ? `Not assessed yet, so treated as Ad hoc; target is level ${target}.` : `Currently level ${current}; target is level ${target} (gap ${gap}).`)
    const relevant = !profile.systemTypes.length || practice.systemTypes.some((type) => profile.systemTypes.includes(type))
    const relevance = relevant ? 1 : 0.5
    if (!relevant) reasons.push('Less relevant: it does not apply to the AI system types in your profile.')
    let priority = gap * practice.riskWeight * relevance
    reasons.push(`Risk weight ${practice.riskWeight} of 3.`)

    if (inAustralia) {
      const deadline = deadlinePoints(practice, todayTime, profile)
      if (deadline) { priority += deadline.points; reasons.push(deadline.reason) }
    }
    const dependants = corpus.practices.filter((other) => other.id !== practice.id && onRoadmap.has(other.id) && other.prerequisites.includes(practice.id))
    if (dependants.length) { priority += 0.5 * dependants.length; reasons.push(`Foundation for ${dependants.map((other) => other.id).join(', ')}.`) }
    const sector = practice.australia.sectorNotes.find((note) => profile.regulated.some((flag) => sectorPatterns[flag]?.test(note.sector)))
    if (sector) { priority += 1; reasons.push(`Has specific expectations for ${sector.sector}.`) }

    return {
      practiceId: practice.id, title: practice.title, domain: practice.domain, current, target, gap,
      priority: round(priority), bucket: 'later', owner: practice.roles.accountableTitle,
      prerequisites: practice.prerequisites.filter((id) => onRoadmap.has(id)), reasons,
    }
  })

  // Rank, fill buckets by capacity, then push anything scheduled before its prerequisites.
  const ranked = [...items].sort((a, b) => b.priority - a.priority || a.practiceId.localeCompare(b.practiceId))
  ranked.forEach((item, index) => { item.bucket = index < capacity.now ? 'now' : index < capacity.now + capacity.next ? 'next' : 'later' })
  const byId = new Map(items.map((item) => [item.practiceId, item]))
  for (let changed = true, guard = 0; changed && guard < items.length * 3; guard++) {
    changed = false
    for (const item of items) for (const id of item.prerequisites) {
      const prerequisite = byId.get(id)!
      if (bucketOrder.indexOf(prerequisite.bucket) > bucketOrder.indexOf(item.bucket)) {
        item.bucket = prerequisite.bucket
        item.reasons = item.reasons.filter((reason) => !reason.endsWith(`after ${id}, a prerequisite.`))
        item.reasons.push(`Moved to ${bucketNames[item.bucket]} so it comes after ${id}, a prerequisite.`)
        changed = true
      }
    }
  }
  return topologicalWithin(ranked, byId)
}

/* Dates written for a particular kind of organisation only count when the profile says they apply. */
export function keyDateApplies(label: string, profile: Profile) {
  if (/^Commonwealth agencies/i.test(label) && !profile.regulated.includes('commonwealth-agency')) return false
  if (/\bWA\b|Western Australia/i.test(label) && !profile.jurisdictions.includes('AU-WA')) return false
  if (/^APRA/i.test(label) && !profile.regulated.includes('apra')) return false
  return true
}

function deadlinePoints(practice: Practice, todayTime: number, profile: Profile) {
  let best: { points: number; reason: string } | undefined
  for (const keyDate of practice.australia.keyDates) {
    if (!keyDateApplies(keyDate.label, profile)) continue
    const days = Math.round((Date.parse(`${keyDate.date}T00:00:00Z`) - todayTime) / DAY)
    const candidate = days >= 0 && days <= 180 ? { points: 3, reason: `Australian key date in ${days} days: ${keyDate.label} (${keyDate.date}).` }
      : days > 180 && days <= 365 ? { points: 1.5, reason: `Australian key date within 12 months: ${keyDate.label} (${keyDate.date}).` }
      : days < 0 && days >= -365 ? { points: 3, reason: `Already in effect since ${keyDate.date}: ${keyDate.label}.` }
      : undefined
    if (candidate && (!best || candidate.points > best.points)) best = candidate
  }
  return best
}

/* Within each bucket keep priority order, but place prerequisites before the practices that need them. */
function topologicalWithin(ranked: RoadmapItem[], byId: Map<string, RoadmapItem>): RoadmapItem[] {
  const output: RoadmapItem[] = []
  for (const bucket of bucketOrder) {
    const members = ranked.filter((item) => item.bucket === bucket)
    const placed = new Set<string>()
    const place = (item: RoadmapItem, trail = new Set<string>()) => {
      if (placed.has(item.practiceId) || trail.has(item.practiceId)) return
      trail.add(item.practiceId)
      for (const id of item.prerequisites) { const prerequisite = byId.get(id); if (prerequisite?.bucket === bucket) place(prerequisite, trail) }
      placed.add(item.practiceId)
      output.push(item)
    }
    members.forEach((item) => place(item))
  }
  return output
}

export const bucketNames: Record<Bucket, string> = { now: 'Now', next: 'Next', later: 'Later' }
export const domainName = (domain: DomainId) => domains[domain].name
