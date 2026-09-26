import { promptTypeNames, roles, systemTypes, type PromptType } from './facets'
import type { Practice } from './schema'
import type { Profile } from './workspace'

/*
 * Assembles a ready-to-paste prompt from a practice's prompt kit and the user's profile.
 * This runs in the browser (or the user's own agent), so the profile never leaves their device.
 * Output is deterministic: the same inputs always give the same text.
 */
export const sensitivityNote =
  'Safe to paste: this prompt, your public documents and non-confidential descriptions of your organisation. ' +
  'Do not paste personal information, customer data or confidential material into consumer AI tools. ' +
  'For confidential work, use an AI tool your organisation has approved, with data-protection terms that suit the material.'

export const honestyRules = [
  'Use only the material I provide and sources you can name. Do not invent citations, section numbers, statistics, quotes or case names.',
  'When you refer to a law, standard or guidance document, name it precisely so I can check it.',
  'List every assumption you make.',
  'Mark anything uncertain, or that needs a decision by us, with [TO CONFIRM].',
  'This is a working draft for review by accountable people. It is not legal advice.',
  'Write in plain English, specific to our context. Avoid generic filler.',
]

export type AssembledPrompt = { type: PromptType; title: string; text: string; checklist: string[]; sensitivity: string; version: string }

const sizeNames: Record<NonNullable<Profile['size']>, string> = { small: 'Small (under 50 people)', medium: 'Medium (50–249 people)', large: 'Large (250–4,999 people)', enterprise: 'Enterprise (5,000+ people)' }
const jurisdictionNames: Record<Profile['jurisdictions'][number], string> = {
  AU: 'Australia', 'AU-WA': 'Western Australia (state public sector)', NZ: 'New Zealand', EU: 'European Union', UK: 'United Kingdom', US: 'United States', CA: 'Canada', SG: 'Singapore', HK: 'Hong Kong', JP: 'Japan', KR: 'South Korea', CN: 'China', Other: 'Other',
}
const regulatedNames: Record<Profile['regulated'][number], string> = {
  apra: 'APRA-regulated', 'asic-licensee': 'ASIC licensee', 'commonwealth-agency': 'Commonwealth agency', 'state-agency': 'State or territory agency', health: 'Health service provider', 'critical-infrastructure': 'Critical infrastructure',
}

export function contextLines(profile?: Profile): string[] {
  const unknown = '[TO CONFIRM]'
  if (!profile) return ['Organisation details not provided: ask me for them, or mark assumptions [TO CONFIRM].']
  return [
    `Organisation: ${profile.orgName || 'our organisation'}`,
    `Sector: ${profile.sector || unknown}`,
    `Size: ${profile.size ? sizeNames[profile.size] : unknown}`,
    `Jurisdictions: ${profile.jurisdictions.length ? profile.jurisdictions.map((code) => jurisdictionNames[code]).join(', ') : unknown}`,
    ...(profile.regulated.length ? [`Regulatory status: ${profile.regulated.map((flag) => regulatedNames[flag]).join(', ')}`] : []),
    `AI system types in use: ${profile.systemTypes.length ? profile.systemTypes.map((type) => systemTypes[type].name).join(', ') : unknown}`,
    `Risk appetite for AI: ${profile.riskAppetite ?? unknown}`,
    ...(profile.notes ? [`Other context: ${profile.notes}`] : []),
  ]
}

export function assemblePrompt(practice: Practice, type: PromptType, profile?: Profile): AssembledPrompt {
  const prompt = practice.prompts[type]
  const bullets = (items: string[]) => items.map((item) => `- ${item}`).join('\n')
  const numbered = (items: string[]) => items.map((item, index) => `${index + 1}. ${item}`).join('\n')
  const blocks = [
    `# ${prompt.title}`,
    `You are helping us apply the practice "${practice.title}" (${practice.id}, version ${practice.version}) from AI Trust Practice. ${practice.purpose}`,
    `## Our context\n${bullets(contextLines(profile))}`,
    `## Task\n${prompt.task}`,
    ...(prompt.template ? [`## Template to adapt\n${prompt.template.title} (${prompt.template.publisher}): ${prompt.template.url}`] : []),
    ...(prompt.inputs.length ? [`## What I will give you\n${bullets(prompt.inputs)}\nIf anything here is missing, ask me for it before you start, or proceed and mark the gaps [TO CONFIRM].`] : []),
    `## Output structure\nProduce the output with exactly these sections, in this order:\n${numbered(prompt.sections.some((section) => /confirm|assumption/i.test(section)) ? prompt.sections : [...prompt.sections, 'Assumptions and items to confirm'])}`,
    `## What good looks like\n${practice.outcome}`,
    ...(type === 'review' ? [`## Evidence tests to apply\n${bullets(practice.evidenceTests.map((test) => `${test.id}: ${test.test}`))}`] : []),
    ...(type === 'draft' || type === 'adapt' ? [`## Steps this supports\n${bullets(practice.steps.foundations.map((step) => step.title))}`] : []),
    ...(type === 'communicate' ? [`## Audience\n${roles[practice.roles.accountable].name} and the people they report to. Keep it to what they need to decide or note.`] : []),
    `## Rules\n${bullets(honestyRules)}`,
  ]
  return { type, title: prompt.title, text: blocks.join('\n\n'), checklist: checklist(practice), sensitivity: sensitivityNote, version: prompt.version }
}

/* "Check the output": a short human review list derived from the practice's evidence tests. */
export function checklist(practice: Practice): string[] {
  return [
    'Every law, standard or guidance document it names is real, and you have opened the ones it relies on.',
    'Every [TO CONFIRM] has an owner, and nothing uncertain is stated as fact.',
    'It describes your organisation, not a generic one: names, systems and numbers are yours.',
    ...practice.evidenceTests.slice(0, 3).map((test) => `It supports evidence test ${test.id}, which looks for: ${lowerFirst(test.evidence)}.`),
    `A named person (${practice.roles.accountableTitle.toLowerCase()}) has reviewed it before it is used.`,
  ]
}

export const promptLabel = (type: PromptType) => promptTypeNames[type]
const lowerFirst = (text: string) => (/^[A-Z][a-z]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text)
