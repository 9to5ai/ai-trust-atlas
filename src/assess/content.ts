import { controlFamilies, controlObjectives } from '../data/controls'
import type { ControlObjective } from '../types'

/*
 * Self-assessment content. It deliberately lives outside src/data: responses
 * are a user's self-reported view of their own organisation, stored only in
 * their browser, and never become part of the public Atlas corpus.
 */
export type Level = 0 | 1 | 2 | 3 | 4 | 5
export const levels: { level: Level; name: string; description: string }[] = [
  { level: 0, name: 'Not started', description: 'No defined approach. Activity, if any, is incidental.' },
  { level: 1, name: 'Initial', description: 'Ad hoc and dependent on individuals, with little documentation or consistency.' },
  { level: 2, name: 'Developing', description: 'Defined for some AI systems but applied inconsistently; evidence is partial.' },
  { level: 3, name: 'Defined', description: 'Documented, owned and applied to in-scope AI systems, with evidence retained.' },
  { level: 4, name: 'Managed', description: 'Measured against thresholds, exceptions tracked, and subject to independent challenge.' },
  { level: 5, name: 'Optimising', description: 'Improved continuously from monitoring, incidents, testing and external developments.' },
]

export type EvidenceStatus = 'not-requested' | 'requested' | 'received' | 'reviewed'
export const evidenceLabels: Record<EvidenceStatus, string> = { 'not-requested': 'Not requested', requested: 'Requested', received: 'Received', reviewed: 'Reviewed' }

export type AssessmentItem = {
  control: ControlObjective
  familyName: string
  lookFor: string
  designProcedures: string[]
  operatingProcedures: string[]
  evidenceRequests: string[]
}

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '')

/* Candidate procedures, phrased as steps to consider rather than conclusions. */
export const assessmentItems: AssessmentItem[] = controlObjectives.map((control) => ({
  control,
  familyName: controlFamilies.find((family) => family.id === control.familyId)?.name ?? control.familyId,
  lookFor: `At “Defined”, the organisation can show that it ${lower(control.objective)}, for every in-scope AI system, with named owners and retained evidence.`,
  designProcedures: [
    `Obtain the policy, standard or procedure that sets out how the organisation intends to ${lower(control.objective)}.`,
    `Check that roles, thresholds and escalation routes are defined for ${control.roleArchetypes.slice(0, 2).join(' and ') || 'accountable roles'}.`,
    `Confirm the design covers the lifecycle stages it should: ${control.lifecycleStages.join(', ')}.`,
  ],
  operatingProcedures: [
    `Select a sample of in-scope AI systems and inspect evidence such as ${control.evidenceExamples.slice(0, 2).map(lower).join(' and ')}.`,
    'Re-perform or observe the activity for at least one system and compare the result with what was recorded.',
    'Identify exceptions and confirm they were escalated and resolved in line with the defined process.',
  ],
  evidenceRequests: control.evidenceExamples,
}))

export const assessmentItemById = new Map(assessmentItems.map((item) => [item.control.id, item]))
export const assessmentFamilies = controlFamilies.map((family) => ({ family, items: assessmentItems.filter((item) => item.control.familyId === family.id) }))

export const assessmentDisclaimer = 'Self-reported maturity for discussion. This is not an audit, an assurance conclusion or a statement of compliance; ratings reflect the views of the people who completed it.'
