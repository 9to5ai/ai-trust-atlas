import type { MappingAssertion } from '../types'
import { controlObjectives } from './controls'
import { instruments } from './instruments'

/*
 * Crosswalk from the Atlas's 24 candidate control objectives to specific
 * provisions. Every link is an Atlas interpretation (basis atlas-synthesis,
 * confidence medium) drafted 24 September 2026 and held as 'provisional'
 * until editorial review. A mapping means the control objective may help
 * address the provision; it never means the control satisfies it. An empty
 * cell means no mapping has been recorded, not that nothing is required.
 */
export const CROSSWALK_DRAFTED = '2026-09-24'

export type CrosswalkFramework = { id: string; label: string; shortLabel: string; instrumentIds: string[]; note: string }

export const crosswalkFrameworks: CrosswalkFramework[] = [
  { id: 'eu-ai-act', label: 'EU AI Act', shortLabel: 'EU AI Act', instrumentIds: ['eu-ai-act'], note: 'Articles as amended; application dates vary by obligation.' },
  { id: 'iso-42001', label: 'ISO/IEC 42001', shortLabel: 'ISO 42001', instrumentIds: ['iso-42001'], note: 'Clause and Annex A titles only; the standard text is licensed.' },
  { id: 'nist-ai-rmf', label: 'NIST AI RMF', shortLabel: 'NIST RMF', instrumentIds: ['nist-ai-rmf'], note: 'Selected subcategories from the AI RMF 1.0 core.' },
  { id: 'apra', label: 'APRA CPS 230 and CPS 234', shortLabel: 'APRA', instrumentIds: ['apra-cps-230', 'apra-cps-234'], note: 'Prudential standards for APRA-regulated entities.' },
  { id: 'au-ai6', label: 'Australian Guidance for AI Adoption', shortLabel: 'AU AI6', instrumentIds: ['au-ai-adoption-guidance'], note: 'The six essential practices (October 2025).' },
]

const mappings: Record<string, string[]> = {
  'accountable-ownership': ['eu-ai-act-17', 'eu-ai-act-26', 'iso42001-leadership', 'iso42001-a3', 'nist-govern-3-2', 'cps230-operational-risk', 'cps234-roles', 'ai6-accountable'],
  'ai-inventory-classification': ['eu-ai-act-6', 'iso42001-context', 'iso42001-a4', 'nist-govern-1-6', 'cps234-classification', 'ai6-information'],
  'decision-rights-approval': ['iso42001-leadership', 'iso42001-a3', 'nist-govern-3-2', 'cps234-roles', 'ai6-accountable'],
  'competence-challenge': ['eu-ai-act-4', 'eu-ai-act-26', 'iso42001-support', 'cps230-independent-review', 'ai6-accountable'],
  'context-materiality': ['eu-ai-act-6', 'iso42001-context', 'nist-map-1-1', 'cps230-tolerance-dimensions', 'ai6-impacts'],
  'impact-risk-assessment': ['eu-ai-act-9', 'eu-ai-act-27', 'iso42001-planning', 'iso42001-operation', 'iso42001-a5', 'nist-map-5-1', 'cps230-operational-risk', 'ai6-impacts', 'ai6-risks'],
  'data-model-provenance': ['eu-ai-act-10', 'eu-ai-act-53', 'iso42001-a7'],
  'third-party-assessment': ['eu-ai-act-53', 'iso42001-a10', 'nist-govern-6-1', 'cps230-provider', 'cps234-third-parties', 'ai6-information'],
  'least-privilege-access': ['eu-ai-act-15', 'cps234-controls'],
  'secure-ai-development': ['eu-ai-act-15', 'iso42001-a6', 'nist-measure-2-7', 'cps234-controls'],
  'privacy-data-protection': ['eu-ai-act-10', 'iso42001-a7', 'cps234-classification'],
  'agent-runtime-constraints': ['nist-manage-2-4', 'ai6-human-control'],
  'ai-notice-disclosure': ['eu-ai-act-13', 'eu-ai-act-50', 'iso42001-a8', 'ai6-information'],
  'explanation-limitations': ['eu-ai-act-13', 'iso42001-a8', 'ai6-information'],
  'contestability-redress': ['nist-manage-4-1'],
  'records-traceability': ['eu-ai-act-11', 'eu-ai-act-12', 'iso42001-support'],
  'fit-for-purpose-evaluation': ['eu-ai-act-9', 'eu-ai-act-15', 'iso42001-a6', 'nist-measure-2-1', 'nist-measure-2-3', 'cps230-test-review', 'ai6-test-monitor'],
  'fairness-rights-testing': ['eu-ai-act-10', 'eu-ai-act-27', 'iso42001-a5', 'ai6-impacts'],
  'adversarial-security-testing': ['eu-ai-act-15', 'eu-ai-act-55', 'nist-measure-2-7', 'cps234-controls'],
  'runtime-monitoring': ['eu-ai-act-26', 'eu-ai-act-72', 'iso42001-performance', 'nist-manage-4-1', 'cps230-operational-risk', 'ai6-test-monitor'],
  'incident-response-reporting': ['eu-ai-act-55', 'eu-ai-act-73', 'iso42001-a8', 'iso42001-improvement', 'nist-manage-4-3', 'cps230-incidents', 'cps234-incidents'],
  'human-intervention-safe-stop': ['eu-ai-act-14', 'iso42001-a9', 'nist-manage-2-4', 'ai6-human-control'],
  'resilience-rollback-continuity': ['eu-ai-act-15', 'nist-measure-2-7', 'cps230-tolerance-dimensions', 'cps230-bcp-dependencies', 'cps230-test-review'],
  'change-release-retirement': ['eu-ai-act-43', 'iso42001-operation', 'iso42001-a6', 'nist-manage-4-1', 'ai6-risks'],
}

const provisionIndex = new Map(instruments.flatMap((instrument) => instrument.provisions.map((provision) => [provision.id, { provision, instrument }] as const)))
const frameworkForInstrument = new Map(crosswalkFrameworks.flatMap((framework) => framework.instrumentIds.map((id) => [id, framework.id] as const)))

export const crosswalkAssertions: MappingAssertion[] = controlObjectives.flatMap((control) => (mappings[control.id] ?? []).map((provisionId) => {
  const entry = provisionIndex.get(provisionId)
  if (!entry) throw new Error(`Crosswalk references unknown provision ${provisionId}`)
  if (!frameworkForInstrument.has(entry.instrument.id)) throw new Error(`Crosswalk provision ${provisionId} is outside the crosswalk frameworks`)
  const { provision, instrument } = entry
  return {
    id: `map:crosswalk:${control.id}:${provisionId}`,
    sourceNodeId: `control-objective:${control.id}`,
    predicate: 'may-address' as const,
    targetNodeId: `provision:${provisionId}`,
    rationale: `${control.code} ${control.name} may help address ${instrument.shortTitle} ${provision.ref} (“${provision.title}”). Atlas interpretation for review; it does not establish that the control satisfies the provision.`,
    basis: 'atlas-synthesis' as const,
    confidence: 'medium' as const,
    citations: [{ sourceTitle: instrument.title, locator: provision.ref, url: provision.sourceUrl ?? instrument.officialUrl, accessedAt: CROSSWALK_DRAFTED, sourceVersion: instrument.effective ?? instrument.published }],
    createdBy: 'AI Trust Atlas' as const,
    verifiedAt: CROSSWALK_DRAFTED,
    status: 'provisional' as const,
    inferenceDepth: 1 as const,
  }
}))

export const crosswalkFrameworkFor = (instrumentId: string) => frameworkForInstrument.get(instrumentId)
