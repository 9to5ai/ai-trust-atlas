import { crosswalkMatrix, type CrosswalkLink } from '../lib/crosswalk'
import { assessmentFamilies, assessmentItems, type AssessmentItem } from './content'
import type { Assessment } from './store'

const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined)
const crosswalkRows = new Map(crosswalkMatrix().map((row) => [row.control.id, row]))

export type Gap = { item: AssessmentItem; current: number; target: number; gap: number; weight: number; links: CrosswalkLink[] }

export function scoreAssessment(assessment: Assessment) {
  const rated = assessmentItems.filter((item) => assessment.responses[item.control.id]?.current !== undefined)
  const families = assessmentFamilies.map(({ family, items }) => {
    const responses = items.map((item) => assessment.responses[item.control.id]).filter(Boolean)
    return {
      family,
      current: average(responses.flatMap((response) => (response!.current !== undefined ? [response!.current] : []))),
      target: average(responses.flatMap((response) => (response!.target !== undefined ? [response!.target] : []))),
      rated: responses.filter((response) => response!.current !== undefined).length,
      total: items.length,
    }
  })
  const gaps: Gap[] = assessmentItems.flatMap((item) => {
    const response = assessment.responses[item.control.id]
    if (response?.current === undefined || response.target === undefined || response.target <= response.current) return []
    const links = crosswalkRows.get(item.control.id)?.cells.flatMap((cell) => cell.links) ?? []
    const gap = response.target - response.current
    // Prioritise larger gaps on controls linked to more risks and obligations.
    const weight = gap * (1 + item.control.riskIds.length / 12 + links.length / 16)
    return [{ item, current: response.current, target: response.target, gap, weight, links }]
  }).sort((a, b) => b.weight - a.weight)
  const evidence = assessmentItems.map((item) => ({ item, status: assessment.responses[item.control.id]?.evidence ?? 'not-requested' }))
  return {
    rated: rated.length,
    total: assessmentItems.length,
    current: average(rated.map((item) => assessment.responses[item.control.id]!.current!)),
    target: average(assessmentItems.flatMap((item) => (assessment.responses[item.control.id]?.target !== undefined ? [assessment.responses[item.control.id]!.target!] : []))),
    families,
    gaps,
    evidence,
  }
}

/* Obligations touched by the largest gaps, grouped by framework. */
export function obligationsForGaps(gaps: Gap[], top = 5) {
  const grouped = new Map<string, { framework: string; provisions: Map<string, CrosswalkLink> }>()
  for (const gap of gaps.slice(0, top)) {
    for (const link of gap.links) {
      const key = link.instrument.shortTitle
      const entry = grouped.get(key) ?? { framework: key, provisions: new Map() }
      entry.provisions.set(link.provision.id, link)
      grouped.set(key, entry)
    }
  }
  return [...grouped.values()].map((entry) => ({ framework: entry.framework, provisions: [...entry.provisions.values()] }))
}

export const formatScore = (value: number | undefined) => (value === undefined ? '—' : value.toFixed(1))
