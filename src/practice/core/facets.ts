/*
 * The four facets every practice is tagged on. These labels are public: they describe
 * the structure of AI Trust Practice, not its gated content.
 */
export const domainIds = ['governance', 'risk', 'data', 'security', 'testing', 'transparency', 'fairness', 'third-party'] as const
export const stageIds = ['strategy', 'design', 'build', 'validate', 'deploy', 'monitor', 'retire', 'organisation-wide'] as const
export const systemTypeIds = ['traditional-ml', 'genai', 'agents', 'vendor'] as const
export const roleIds = ['board', 'executive', 'second-line', 'builders', 'internal-audit'] as const

export type DomainId = (typeof domainIds)[number]
export type StageId = (typeof stageIds)[number]
export type SystemTypeId = (typeof systemTypeIds)[number]
export type RoleId = (typeof roleIds)[number]

/* The Australian Guidance for AI Adoption's six essential practices (National AI Centre, October 2025). */
export const sixPracticeIds = ['1', '2', '3', '4', '5', '6'] as const
export type SixPracticeId = (typeof sixPracticeIds)[number]

export const domains: Record<DomainId, { name: string; code: string; sixPractices: SixPracticeId[] }> = {
  governance: { name: 'Governance and accountability', code: 'GOV', sixPractices: ['1'] },
  risk: { name: 'Risk and impact', code: 'RSK', sixPractices: ['2', '3'] },
  data: { name: 'Data and privacy', code: 'DAT', sixPractices: ['3', '4'] },
  security: { name: 'Security', code: 'SEC', sixPractices: ['3', '5'] },
  testing: { name: 'Testing and monitoring', code: 'TM', sixPractices: ['5'] },
  transparency: { name: 'Transparency and human oversight', code: 'TRN', sixPractices: ['4', '6'] },
  fairness: { name: 'Fairness', code: 'FAI', sixPractices: ['2', '5'] },
  'third-party': { name: 'Third party', code: 'TP', sixPractices: ['1', '3'] },
}

export const stages: Record<StageId, { name: string }> = {
  strategy: { name: 'Strategy' },
  design: { name: 'Design' },
  build: { name: 'Build' },
  validate: { name: 'Validate' },
  deploy: { name: 'Deploy' },
  monitor: { name: 'Monitor' },
  retire: { name: 'Retire' },
  'organisation-wide': { name: 'Organisation-wide' },
}

export const systemTypes: Record<SystemTypeId, { name: string }> = {
  'traditional-ml': { name: 'Traditional ML' },
  genai: { name: 'GenAI applications' },
  agents: { name: 'Agents' },
  vendor: { name: 'Third-party / vendor AI' },
}

export const roles: Record<RoleId, { name: string }> = {
  board: { name: 'Board' },
  executive: { name: 'Executive' },
  'second-line': { name: 'Second-line risk and compliance' },
  builders: { name: 'Builders' },
  'internal-audit': { name: 'Internal audit' },
}

export const sixPractices: Record<SixPracticeId, { name: string; atlasSection: string }> = {
  '1': { name: 'Decide who is accountable', atlasSection: 'ai6-accountable' },
  '2': { name: 'Understand impacts and plan accordingly', atlasSection: 'ai6-impacts' },
  '3': { name: 'Measure and manage risks', atlasSection: 'ai6-risks' },
  '4': { name: 'Share essential information', atlasSection: 'ai6-information' },
  '5': { name: 'Test and monitor', atlasSection: 'ai6-test-monitor' },
  '6': { name: 'Maintain human control', atlasSection: 'ai6-human-control' },
}

/* Maturity levels, applied consistently across practices. */
export const maturityLevels = [
  { level: 1, name: 'Ad hoc', meaning: 'Done inconsistently or not at all' },
  { level: 2, name: 'Defined', meaning: 'Documented, with an owner' },
  { level: 3, name: 'Operating', meaning: 'Performed routinely, with evidence it happens' },
  { level: 4, name: 'Assured', meaning: 'Independently tested and improved from monitoring or incidents' },
] as const
export type Level = 1 | 2 | 3 | 4

export const promptTypes = ['draft', 'adapt', 'review', 'communicate'] as const
export type PromptType = (typeof promptTypes)[number]
export const promptTypeNames: Record<PromptType, string> = { draft: 'Draft', adapt: 'Adapt', review: 'Review', communicate: 'Communicate' }
