import { z } from 'zod'
import { domainIds, promptTypes, roleIds, sixPracticeIds, stageIds, systemTypeIds } from './facets'

/*
 * The practice record. One YAML file per practice in the private content repo is
 * validated against this schema at build time; the build also emits it as JSON Schema
 * so agents and editors can validate their own copies.
 */
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
const text = z.string().trim().min(1)
export const practiceIdPattern = /^(GOV|RSK|DAT|SEC|TM|TRN|FAI|TP)-\d{2}$/
const practiceId = z.string().regex(practiceIdPattern, 'Practice IDs look like TM-03')
const semver = z.string().regex(/^\d+\.\d+\.\d+$/, 'Use a semantic version such as 1.2.0')

/* A citation is a source ID from sources.yaml, optionally with a locator ("s 2.3", "p. 14"). */
export const citationSchema = z.union([text, z.object({ source: text, at: text.optional() }).strict()])

export const sourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: text,
  /* Short label for citation chips, e.g. "OAIC ADM issues paper". */
  short: text.max(60).optional(),
  publisher: text,
  url: z.url(),
  kind: z.enum(['law', 'regulation', 'regulator-guidance', 'government-guidance', 'standard', 'framework', 'research', 'practitioner', 'template']),
  jurisdiction: text,
  published: text.optional(),
  lastVerified: date,
  /* The matching Atlas source, when the Atlas holds one. */
  atlasSource: text.optional(),
  note: text.optional(),
}).strict()

const atlasLinksSchema = z.object({
  controls: z.array(text).default([]),
  sections: z.array(text).default([]),
  sources: z.array(text).default([]),
  concepts: z.array(text).default([]),
  requirements: z.array(text).default([]),
}).strict()

const stepSchema = z.object({
  id: z.string().regex(/^[FI]\d+$/, 'Foundations steps are F1, F2…; Implementation steps are I1, I2…'),
  title: text,
  detail: text,
  sources: z.array(citationSchema).min(1, 'Every step must be traceable to a source'),
}).strict()

const templateSchema = z.object({ title: text, publisher: text, url: z.url(), note: text.optional() }).strict()

const promptSchema = z.object({
  title: text,
  /* The instruction to the AI tool, written in the second person. */
  task: text,
  /* What to paste in alongside the prompt. */
  inputs: z.array(text).default([]),
  /* The artefact's required sections, so results are consistent across AI tools. */
  sections: z.array(text).min(2),
  /* For adapt prompts: the external template being tailored. */
  template: templateSchema.optional(),
  version: semver,
  lastTested: date.optional(),
  testedIn: z.array(z.object({ tool: text, date }).strict()).default([]),
}).strict()

export const practiceSchema = z.object({
  id: practiceId,
  title: text,
  version: semver,
  status: z.enum(['draft', 'under-review', 'approved']),
  wave: z.union([z.literal(1), z.literal(2)]),
  flagship: z.boolean().optional(),
  /* Included in the quick, ten-minute assessment. */
  quick: z.boolean().optional(),
  lastReviewed: date.optional(),
  lastVerified: date,
  practitionerReview: z.object({ by: text, date }).strict().optional(),

  domain: z.enum(domainIds),
  stages: z.array(z.enum(stageIds)).min(1),
  systemTypes: z.array(z.enum(systemTypeIds)).min(1),
  /* 1 = foundational hygiene, 3 = failure causes direct harm to people or serious regulatory exposure. */
  riskWeight: z.union([z.literal(1), z.literal(2), z.literal(3)]),

  summary: text,
  purpose: text,
  outcome: text,
  prerequisites: z.array(practiceId).default([]),

  steps: z.object({ foundations: z.array(stepSchema).min(2), implementation: z.array(stepSchema).min(2) }).strict(),
  checkpoints: z.array(z.object({ id: z.string().regex(/^C\d+$/), decision: text, who: z.enum(roleIds).or(text), why: text }).strict()).min(1),
  roles: z.object({ accountable: z.enum(roleIds), accountableTitle: text, contributors: z.array(z.object({ role: z.enum(roleIds), title: text }).strict()).default([]) }).strict(),
  artefacts: z.array(z.object({ name: text, description: text, templates: z.array(templateSchema).default([]) }).strict()).min(1),
  evidenceTests: z.array(z.object({
    id: z.string().regex(/^E\d+$/),
    test: text,
    method: z.enum(['inspect', 'reperform', 'inquire', 'observe', 'analyse']),
    evidence: text,
  }).strict()).min(3, 'At least three evidence tests'),
  maturity: z.array(z.object({ level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]), criteria: z.array(text).min(1) }).strict())
    .length(4, 'Four maturity levels')
    .refine((levels) => levels.every((entry, index) => entry.level === index + 1), 'Maturity levels must run 1 to 4 in order'),
  variations: z.object({ 'traditional-ml': z.array(text).optional(), genai: z.array(text).optional(), agents: z.array(text).optional(), vendor: z.array(text).optional() }).strict(),

  australia: z.object({
    sixPractices: z.array(z.enum(sixPracticeIds)).min(1),
    /* Voluntary AI Safety Standard guardrails, 1–10 (secondary crosswalk). */
    guardrails: z.array(z.number().int().min(1).max(10)).default([]),
    obligations: z.array(z.object({ kind: z.enum(['obligation', 'expectation', 'guidance']), text, sources: z.array(citationSchema).min(1), atlas: atlasLinksSchema.partial().optional() }).strict()).min(1),
    templates: z.array(templateSchema).default([]),
    sectorNotes: z.array(z.object({ sector: text, note: text, sources: z.array(citationSchema).min(1) }).strict()).default([]),
    keyDates: z.array(z.object({ date, label: text, sources: z.array(citationSchema).min(1) }).strict()).default([]),
  }).strict(),
  crosswalks: z.object({
    nistAiRmf: z.array(text).default([]),
    iso42001: z.array(text).default([]),
    other: z.array(z.object({ framework: text, refs: z.array(text).min(1) }).strict()).default([]),
  }).strict(),
  atlas: atlasLinksSchema,

  prompts: z.object(Object.fromEntries(promptTypes.map((type) => [type, promptSchema])) as Record<(typeof promptTypes)[number], typeof promptSchema>).strict(),
  agent: z.object({
    interview: z.array(text).min(3),
    /* Checkpoint IDs the agent must stop for. */
    stopAt: z.array(z.string().regex(/^C\d+$/)).min(1),
    done: z.array(text).min(2),
  }).strict(),

  sources: z.array(citationSchema).min(1),
  changelog: z.array(z.object({ version: semver, date, summary: text }).strict()).min(1),
}).strict()

export type Citation = z.infer<typeof citationSchema>
export type Source = z.infer<typeof sourceSchema>
export type Practice = z.infer<typeof practiceSchema>
export type PracticePrompt = z.infer<typeof promptSchema>
export type AtlasLinks = z.infer<typeof atlasLinksSchema>

/* The compiled corpus: what the web app, the MCP server and the skill package all read. */
export type Corpus = {
  schemaVersion: 1
  /* Corpus release, e.g. 2026.12.0; bumped on every publish. */
  version: string
  generatedAt: string
  /* Random per build; the bundle check fails if it ever appears in the public dist/. */
  buildId: string
  includesDrafts: boolean
  practices: Practice[]
  sources: Source[]
}

export const citationSource = (citation: Citation) => (typeof citation === 'string' ? citation : citation.source)
export const citationLocator = (citation: Citation) => (typeof citation === 'string' ? undefined : citation.at)
