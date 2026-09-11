import { sourcingPolicy } from '../data/sourcingPolicy'
export type Factor = typeof sourcingPolicy.factors[number]['id']
export type Candidate = {
  id: string; supersedesId?: string; title: string; url: string; discovered: string;
  eventKey: string; sourceType: string; authorityNote: string; scope: string;
  publicationDate: string | null; dateBasis: string;
  reviewed: string | null; reviewer: string; reviewDepth: 'unreviewed' | 'metadata' | 'overview' | 'full-text';
  gates: { provenance: boolean; evidence: boolean; rights: boolean; scopeAndStatus: boolean };
  scores: Record<Factor, number>; scoreReasons: Record<Factor, string>;
  relevantBindingChange: boolean;
  decision: 'include' | 'development-only' | 'defer' | 'exclude';
  reason: string; linkedSourceIds: string[];
}
export function assessCandidate(candidate: Candidate) {
  for (const factor of sourcingPolicy.factors) {
    const value = candidate.scores[factor.id]
    if (!Number.isInteger(value) || value < 0 || value > 4) throw new Error(`${candidate.id}: ${factor.id} must be an integer from 0 to 4`)
    if (!candidate.scoreReasons[factor.id]?.trim()) throw new Error(`${candidate.id}: explain ${factor.id}`)
  }
  if (!candidate.id || !candidate.title || !candidate.eventKey || !candidate.reason?.trim() || !candidate.authorityNote || !candidate.scope || !candidate.sourceType || !candidate.dateBasis) throw new Error('Candidate identity, scope, authority and decision rationale are required')
  if (!['include', 'development-only', 'defer', 'exclude'].includes(candidate.decision)) throw new Error('Invalid editorial decision')
  if (!['unreviewed', 'metadata', 'overview', 'full-text'].includes(candidate.reviewDepth)) throw new Error('Invalid review depth')
  const url = new URL(candidate.url)
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('A public source URL is required')
  for (const date of [candidate.discovered, candidate.reviewed, candidate.publicationDate].filter((d): d is string => d !== null)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Use a valid YYYY-MM-DD date; unknown publication dates stay null')
  }
  const failures = (['provenance', 'evidence', 'rights', 'scopeAndStatus'] as const).filter(key => candidate.gates[key] !== true)
  const ready = failures.length === 0 && candidate.reviewDepth !== 'unreviewed' && Boolean(candidate.reviewed && candidate.reviewer.trim())
  if (['include', 'development-only'].includes(candidate.decision) && !ready) throw new Error(`${candidate.id}: publication requires evidence gates and a recorded review`)
  const score = sourcingPolicy.factors.reduce((total, factor) => total + candidate.scores[factor.id] * factor.weight / 4, 0)
  return { id: candidate.id, score, ready, failures, mandatoryReview: candidate.relevantBindingChange, decision: candidate.decision }
}
export function assessLedger(candidates: Candidate[]) {
  const byId = new Map<string, Candidate>(), superseded = new Set<string>()
  for (const candidate of candidates) {
    if (byId.has(candidate.id)) throw new Error(`Duplicate candidate: ${candidate.id}`)
    assessCandidate(candidate)
    if (candidate.supersedesId) {
      const previous = byId.get(candidate.supersedesId)
      if (!previous || previous.eventKey !== candidate.eventKey || superseded.has(previous.id)) throw new Error('Reassessment must supersede the latest earlier decision for the same event')
      superseded.add(previous.id)
    }
    byId.set(candidate.id, candidate)
  }
  const events = new Set<string>()
  return candidates.filter(candidate => !superseded.has(candidate.id)).map(candidate => {
    if (['include', 'development-only'].includes(candidate.decision)) {
      if (events.has(candidate.eventKey)) throw new Error(`Consolidate duplicate development: ${candidate.eventKey}`)
      events.add(candidate.eventKey)
    }
    return assessCandidate(candidate)
  }).sort((a, b) => Number(b.mandatoryReview) - Number(a.mandatoryReview) || b.score - a.score || a.id.localeCompare(b.id))
}
