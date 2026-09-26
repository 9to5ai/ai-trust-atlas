import type { DomainId, RoleId, StageId, SystemTypeId } from './facets'
import { compareVersions } from './validate'
import type { Corpus, Practice } from './schema'

/* Deterministic keyword search and filtering over the corpus, shared by the site and the MCP server. */
export type PracticeFilters = { domain?: DomainId; stage?: StageId; systemType?: SystemTypeId; role?: RoleId }
export type SearchHit = { id: string; title: string; summary: string; domain: DomainId; score: number }

const tokens = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s-]/gu, ' ').split(/\s+/).filter((token) => token.length > 1)

export function matchesFilters(practice: Practice, filters: PracticeFilters = {}) {
  return (!filters.domain || practice.domain === filters.domain)
    && (!filters.stage || practice.stages.includes(filters.stage))
    && (!filters.systemType || practice.systemTypes.includes(filters.systemType))
    && (!filters.role || practice.roles.accountable === filters.role || practice.roles.contributors.some((contributor) => contributor.role === filters.role))
}

export function searchPractices(corpus: Corpus, query: string, filters: PracticeFilters = {}, limit = 10): SearchHit[] {
  const terms = tokens(query)
  const fields = (practice: Practice): [string, number][] => [
    [practice.title, 5], [practice.summary, 3], [practice.purpose, 2], [practice.outcome, 1],
    [[...practice.steps.foundations, ...practice.steps.implementation].map((step) => step.title).join(' '), 1.5],
    [practice.artefacts.map((artefact) => artefact.name).join(' '), 1.5],
    [Object.values(practice.variations).flat().join(' '), 0.5],
    [practice.australia.obligations.map((item) => item.text).join(' '), 0.5],
  ]
  return corpus.practices
    .filter((practice) => matchesFilters(practice, filters))
    .map((practice) => {
      let score = 0
      if (terms.some((term) => term === practice.id.toLowerCase())) score += 20
      for (const [text, weight] of fields(practice)) {
        const words = new Set(tokens(text))
        for (const term of terms) if (words.has(term)) score += weight; else if ([...words].some((word) => word.startsWith(term) && term.length >= 4)) score += weight / 2
      }
      return { id: practice.id, title: practice.title, summary: practice.summary, domain: practice.domain, score: Math.round(score * 10) / 10 }
    })
    .filter((hit) => !terms.length || hit.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit)
}

export type ChangeEntry = { practiceId: string; title: string; version: string; date: string; summary: string }

/*
 * Changelog entries, newest first. `since` is a date (YYYY-MM-DD); `sinceVersions` maps practice IDs to
 * the version the caller last used, so an agent can ask only about practices it has implemented.
 */
export function listChanges(corpus: Corpus, { since, sinceVersions, practiceIds }: { since?: string; sinceVersions?: Record<string, string>; practiceIds?: string[] } = {}): ChangeEntry[] {
  return corpus.practices
    .filter((practice) => !practiceIds || practiceIds.includes(practice.id))
    .flatMap((practice) => practice.changelog
      .filter((entry) => (!since || entry.date > since) && (!sinceVersions?.[practice.id] || compareVersions(entry.version, sinceVersions[practice.id]) > 0))
      .map((entry) => ({ practiceId: practice.id, title: practice.title, ...entry })))
    .sort((a, b) => b.date.localeCompare(a.date) || a.practiceId.localeCompare(b.practiceId))
}
