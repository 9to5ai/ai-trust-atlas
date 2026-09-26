import { z } from 'zod'
import { systemTypeIds } from './facets'

/*
 * The user's workspace: profile, assessment answers, targets, step progress and evidence.
 * It lives only in the browser (or in the user's own agent environment) and moves between
 * devices as an exported JSON file. Nothing here is ever sent to the server.
 */
const level = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}/)
const short = (max: number) => z.string().trim().max(max)

export const jurisdictionIds = ['AU', 'AU-WA', 'NZ', 'EU', 'UK', 'US', 'CA', 'SG', 'HK', 'JP', 'KR', 'CN', 'Other'] as const
export const regulatedFlags = ['apra', 'asic-licensee', 'commonwealth-agency', 'state-agency', 'health', 'critical-infrastructure'] as const

export const profileSchema = z.object({
  orgName: short(120).optional(),
  sector: short(120).optional(),
  size: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
  jurisdictions: z.array(z.enum(jurisdictionIds)).default(['AU']),
  regulated: z.array(z.enum(regulatedFlags)).default([]),
  systemTypes: z.array(z.enum(systemTypeIds)).default([]),
  riskAppetite: z.enum(['low', 'moderate', 'high']).optional(),
  notes: short(1000).optional(),
})

export const answerSchema = z.object({
  level,
  /* Who chose the level. An agent may not rate above Operating without a human attestation. */
  answeredBy: z.enum(['human', 'agent']).default('human'),
  attestedBy: short(120).optional(),
  note: short(2000).optional(),
  at: date,
})

export const provenanceSchema = z.object({
  tool: short(120).optional(),
  model: short(120).optional(),
  date: date.optional(),
  reviewer: short(120).optional(),
})

export const evidenceRecordSchema = z.object({
  id: short(64),
  practiceId: short(8),
  testId: short(8).optional(),
  title: short(200),
  status: z.enum(['planned', 'collected', 'reviewed']),
  location: short(500).optional(),
  note: short(2000).optional(),
  provenance: provenanceSchema.optional(),
  updatedAt: date,
})

export const workspaceSchema = z.object({
  schema: z.literal('ai-trust-practice-workspace'),
  version: z.literal(1),
  /* The corpus version the answers were given against, so agents can pin it. */
  corpusVersion: short(20).optional(),
  createdAt: date,
  updatedAt: date,
  exportedAt: date.optional(),
  profile: profileSchema.default({ jurisdictions: ['AU'], regulated: [], systemTypes: [] }),
  answers: z.record(z.string(), answerSchema).default({}),
  targets: z.record(z.string(), level).default({}),
  steps: z.record(z.string(), z.array(short(8))).default({}),
  evidence: z.array(evidenceRecordSchema).default([]),
})

export type Profile = z.infer<typeof profileSchema>
export type Answer = z.infer<typeof answerSchema>
export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>
export type Provenance = z.infer<typeof provenanceSchema>
export type Workspace = z.infer<typeof workspaceSchema>

export const emptyWorkspace = (now = new Date()): Workspace => ({
  schema: 'ai-trust-practice-workspace',
  version: 1,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  profile: { jurisdictions: ['AU'], regulated: [], systemTypes: [] },
  answers: {},
  targets: {},
  steps: {},
  evidence: [],
})

/* Parses an imported or stored workspace. Unknown practice IDs are kept: they may belong to a newer corpus. */
export function parseWorkspace(input: unknown): { ok: true; workspace: Workspace } | { ok: false; error: string } {
  const result = workspaceSchema.safeParse(migrate(input))
  if (result.success) return { ok: true, workspace: result.data }
  const issue = result.error.issues[0]
  return { ok: false, error: `This file is not a valid AI Trust Practice workspace (${issue.path.join('.') || 'root'}: ${issue.message}).` }
}

/* Future schema versions migrate here, one step at a time. */
function migrate(input: unknown): unknown {
  return input
}
