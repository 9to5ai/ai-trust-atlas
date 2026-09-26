import { domains, maturityLevels, type DomainId, type Level } from './facets'
import { scoreAssessment, type AssessmentResult } from './assessment'
import { buildRoadmap, bucketNames, DEFAULT_TARGET, type RoadmapItem } from './roadmap'
import type { Corpus, Practice } from './schema'
import type { EvidenceRecord, Provenance, Workspace } from './workspace'

/*
 * Compiles the evidence pack and board summary from the workspace: maturity, roadmap, and for each practice its
 * evidence tests with what the organisation has recorded against them, including provenance for AI-produced work.
 * Deterministic, so the same workspace always gives the same pack.
 */
export type EvidenceStatus = 'none' | EvidenceRecord['status']
export const evidenceStatusNames: Record<EvidenceStatus, string> = { none: 'Not started', planned: 'Planned', collected: 'Collected', reviewed: 'Reviewed' }
export const evidenceRecordId = (practiceId: string, testId: string) => `${practiceId}-${testId}`

export type PackTest = { id: string; test: string; method: string; expected: string; status: EvidenceStatus; location?: string; note?: string; provenance?: Provenance; updatedAt?: string }
export type PackPractice = {
  id: string
  title: string
  domain: DomainId
  level?: Level
  levelName?: string
  target: Level
  steps: { done: number; total: number }
  tests: PackTest[]
}
export type EvidencePack = {
  organisation: string
  generatedAt: string
  corpusVersion: string
  result: AssessmentResult
  roadmap: RoadmapItem[]
  practices: PackPractice[]
  counts: Record<EvidenceStatus, number>
  aiProduced: number
  gaps: string[]
}

export function compileEvidencePack(corpus: Corpus, workspace: Workspace, { today, practiceIds }: { today: string; practiceIds?: string[] }): EvidencePack {
  const result = scoreAssessment(corpus, workspace.answers)
  const roadmap = buildRoadmap({ corpus, result, targets: workspace.targets, profile: workspace.profile, today })
  const records = new Map(workspace.evidence.map((record) => [record.id, record]))
  const touched = (practice: Practice) =>
    !!workspace.answers[practice.id] || !!workspace.steps[practice.id]?.length || workspace.evidence.some((record) => record.practiceId === practice.id)
  const chosen = corpus.practices.filter((practice) => (practiceIds ? practiceIds.includes(practice.id) : touched(practice)))

  const counts: Record<EvidenceStatus, number> = { none: 0, planned: 0, collected: 0, reviewed: 0 }
  let aiProduced = 0
  const gaps: string[] = []
  const practices = chosen.map((practice): PackPractice => {
    const level = result.practices[practice.id]?.level
    const target = workspace.targets[practice.id] ?? DEFAULT_TARGET
    const tests = practice.evidenceTests.map((test): PackTest => {
      const record = records.get(evidenceRecordId(practice.id, test.id))
      const status: EvidenceStatus = record?.status ?? 'none'
      counts[status]++
      if (record?.provenance?.tool || record?.provenance?.model) {
        aiProduced++
        if (!record.provenance.reviewer) gaps.push(`${practice.id} ${test.id}: AI-produced evidence has no named reviewer.`)
      }
      if (status === 'none') gaps.push(`${practice.id} ${test.id}: no evidence recorded yet.`)
      return { id: test.id, test: test.test, method: test.method, expected: test.evidence, status, location: record?.location, note: record?.note, provenance: record?.provenance, updatedAt: record?.updatedAt }
    })
    if (level !== undefined && level < target) gaps.push(`${practice.id}: at ${maturityLevels[level - 1].name}, target ${maturityLevels[target - 1].name}.`)
    return {
      id: practice.id, title: practice.title, domain: practice.domain, level, levelName: level ? maturityLevels[level - 1].name : undefined, target,
      steps: { done: workspace.steps[practice.id]?.length ?? 0, total: practice.steps.foundations.length + practice.steps.implementation.length },
      tests,
    }
  })
  return {
    organisation: workspace.profile.orgName || 'Our organisation',
    generatedAt: today,
    corpusVersion: corpus.version,
    result, roadmap, practices, counts, aiProduced, gaps,
  }
}

const csvCell = (value: unknown) => {
  const text = value === undefined || value === null ? '' : String(value)
  // Neutralise spreadsheet formula injection as well as quoting.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function roadmapCsv(items: RoadmapItem[]): string {
  const header = ['Bucket', 'Practice', 'Title', 'Domain', 'Current level', 'Target level', 'Gap', 'Priority', 'Suggested owner', 'Prerequisites', 'Why it is ranked here']
  const rows = items.map((item) => [bucketNames[item.bucket], item.practiceId, item.title, domains[item.domain].name, item.current ?? 'Not assessed', item.target, item.gap, item.priority, item.owner, item.prerequisites.join(' '), item.reasons.join(' ')])
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n'
}

export function evidencePackMarkdown(pack: EvidencePack): string {
  const lines: string[] = []
  const levelText = (practice: PackPractice) => `${practice.levelName ?? 'Not assessed'} → target ${maturityLevels[practice.target - 1].name}`
  lines.push(`# AI trust evidence pack: ${pack.organisation}`)
  lines.push(`Prepared ${pack.generatedAt} with AI Trust Practice (corpus ${pack.corpusVersion}). General information, not legal or professional advice.`)
  lines.push(`## Summary`)
  lines.push([
    `- Practices assessed: ${pack.result.overall.rated} of ${pack.result.overall.total}${pack.result.overall.score !== undefined ? ` (average level ${pack.result.overall.score})` : ''}`,
    `- Evidence: ${pack.counts.reviewed} reviewed, ${pack.counts.collected} collected, ${pack.counts.planned} planned, ${pack.counts.none} not started`,
    `- Evidence produced with AI tools: ${pack.aiProduced}`,
  ].join('\n'))
  const now = pack.roadmap.filter((item) => item.bucket === 'now')
  if (now.length) lines.push(`## Priorities now\n\n${now.map((item) => `- **${item.practiceId} ${item.title}** (owner: ${item.owner}). ${item.reasons[0]}`).join('\n')}`)
  lines.push(`## Practices`)
  for (const practice of pack.practices) {
    lines.push(`### ${practice.id} ${practice.title}`)
    lines.push(`${domains[practice.domain].name} · ${levelText(practice)} · ${practice.steps.done} of ${practice.steps.total} steps done`)
    lines.push('| Test | What an auditor looks for | Status | Where it is | Notes | Provenance |\n|---|---|---|---|---|---|')
    lines.push(practice.tests.map((test) => {
      const provenance = test.provenance && (test.provenance.tool || test.provenance.model || test.provenance.reviewer)
        ? [test.provenance.tool, test.provenance.model, test.provenance.date, test.provenance.reviewer ? `reviewed by ${test.provenance.reviewer}` : 'not yet reviewed'].filter(Boolean).join(', ')
        : ''
      const cell = (text?: string) => (text ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
      return `| ${test.id}: ${cell(test.test)} | ${cell(test.expected)} | ${evidenceStatusNames[test.status]} | ${cell(test.location)} | ${cell(test.note)} | ${cell(provenance)} |`
    }).join('\n'))
  }
  if (pack.gaps.length) lines.push(`## Gaps\n\n${pack.gaps.map((gap) => `- ${gap}`).join('\n')}`)
  return `${lines.join('\n\n')}\n`
}
