import { useCases, useCaseById, useCaseQuestion } from './useCases'
import { incidents, incidentById, incidentQuestion } from './incidents'
import { concepts, domains } from './concepts'
import { controlFamilies, controlObjectives } from './controls'
import { instruments } from './instruments'
import { MIT_RISK_SOURCE_URL, riskDomains, riskSubdomains } from './mitRiskTaxonomy'
import { conceptPrompts, questionsForContext, type Audience, type Question } from './leadershipQuestions'
import { controlQuestions, riskQuestions, sourceQuestions, type RoleQuestions } from './nodeQuestionPrompts'
import type { AuthorityClass, GraphNodeKind, Instrument, SourceProvision } from '../types'

const roles = (board: string, executive: string, regulator: string, assurance: string): RoleQuestions => ({ board, executive, regulator, assurance })
const scopeQuestions: Record<AuthorityClass, RoleQuestions> = {
  law: roles('Who has confirmed which obligations apply to us and which decisions need board attention?', 'Which applicable obligations have an owner, a deadline and evidence of follow-through?', 'What supports the entity’s assessment of its obligations, including exclusions and effective dates?', 'Which obligations would form suitable criteria for an assurance engagement, and has their applicability been evidenced?'),
  treaty: roles('How could these commitments affect our organisation through domestic implementation?', 'Which domestic measures should we track before changing our operating requirements?', 'How are treaty commitments distinguished from duties that already apply domestically?', 'Which domestic implementing measures, if any, could be used as audit criteria today?'),
  'policy-guidance': roles('Which recommendations should influence our decisions, and what has management prioritised?', 'Which recommendations fit our activities, and what work follows from that assessment?', 'How has the organisation considered this guidance within the issuer’s remit and its own context?', 'Has management documented which recommendations it adopted, so we can test against a stated position rather than the whole text?'),
  standard: roles('Why is this standard an appropriate reference for our AI use and assurance needs?', 'Which parts have we adopted, and do we have access to the exact requirements and current edition?', 'What is the basis and scope of any claim made against this standard?', 'Do we have the current edition, and which clauses are in scope for any claim we are asked to assure?'),
  'assurance-standard': roles('What level of assurance do we need over AI, from whom, and what would a report actually conclude on?', 'Which subject matter, criteria and evidence would an assurance practitioner need from us, and are they ready?', 'What does the assurance report cover, against which criteria, and what does it expressly not conclude on?', 'What subject matter, criteria and level of assurance would an engagement use, and what would the report not cover?'),
  framework: roles('Which decisions does this framework help us make, and what does it leave unresolved?', 'Which outcomes have been translated into practical responsibilities and review activities?', 'How has the organisation adapted this framework and identified what its use does not establish?', 'Which framework outcomes has management adopted as its own criteria, and how would we test they operated?'),
  'testing-tool': roles('What deployment decisions could this resource inform, and what would it fail to tell us?', 'Which test conditions, limitations and maintenance needs must we check before using it?', 'How do results from this resource relate to the actual deployment environment?', 'Can we re-perform or independently inspect the results, and what do they not evidence about operation over time?'),
  'research-database': roles('Which findings are relevant enough to change our questions or commission further work?', 'Which findings can we investigate in our environment, and what evidence would we need?', 'How has the organisation distinguished research findings from evidence about its own systems?', 'Is any finding being used as evidence of our own control operation, and is that reliance justified?'),
}

const followOnConcepts: Record<string, string> = {
  'apra-cps-230': 'incident-response',
  'apra-cps-234': 'continuous-monitoring',
  'apra-cps-220': 'risk-treatment',
  'oaic-commercial-ai': 'human-oversight',
  'nist-agent-security-responses': 'evaluation',
  'eu-ai-act': 'human-rights',
  'apra-ai-letter-2026': 'inventory',
}

const sourceRefs = (source: Instrument, section?: SourceProvision) => [{
  title: section ? `${source.shortTitle} · ${section.ref}` : source.shortTitle,
  url: section?.sourceUrl ?? source.officialUrl,
}]
const make = (kind: GraphNodeKind, id: string, slot: string, audience: Audience, content: Omit<Question, 'id' | 'audience'>): Question => ({
  id: `${kind}:${id}:${slot}:${audience}`, audience, ...content,
})

function scopeQuestion(source: Instrument, audience: Audience, section?: SourceProvision): Question {
  const context = section ? `${source.shortTitle} · ${section.ref}: ${section.title}` : source.shortTitle
  const kind = section ? 'provision' : 'instrument'
  const text = section ? roles(
    'Which decisions or practices should this section cause us to examine?',
    'How have we translated the relevant points in this section into work and ownership?',
    'How has the organisation assessed the relevance of this section, including any limits?', 'What evidence would show this section was assessed, and could we re-perform that assessment?')[audience] : scopeQuestions[source.authorityClass][audience]
  return make(kind, section?.id ?? source.id, 'scope', audience, {
    context, text, sources: sourceRefs(source, section),
    basis: section?.summary ?? source.summary,
    why: `${source.authorityNote} ${source.applicability} Confirm the version and scope before deciding what action is appropriate.`,
    askFor: section ? `An assessment of ${section.ref} (${section.title}), with the relevant decisions, responsible people and supporting records. Consult the original text for exact wording.` : `A documented assessment of ${source.shortTitle}, including relevant activities, source version, adoption or applicability decisions, owners and unresolved questions.`,
    followUp: roles('Which unresolved point needs a decision, and by when?', 'Which action is still unowned or depends on an assumption we have not checked?', 'What evidence would change the organisation’s current interpretation?', 'Which conclusion here rests on management assertion alone rather than evidence we can test?')[audience],
  })
}

// Rank within the selected record only: section-backed concepts first, then
// frequency within those sections. This never imports a neighbouring source's claims.
function sourceConcepts(source: Instrument, section?: SourceProvision): string[] {
  if (section) return [...new Set(section.conceptIds)]
  const counts = new Map<string, number>()
  for (const item of source.provisions) for (const id of item.conceptIds) counts.set(id, (counts.get(id) ?? 0) + 1)
  return [...new Set(source.conceptIds)].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
}
function questionsForSource(source: Instrument, audience: Audience, section?: SourceProvision): Question[] {
  const kind = section ? 'provision' : 'instrument'
  const id = section?.id ?? source.id
  const context = section ? `${source.shortTitle} · ${section.ref}: ${section.title}` : source.shortTitle
  const curated = !section ? sourceQuestions[source.id] : undefined
  const conceptIds = sourceConcepts(source, section)
  if (curated) {
    const preferred = followOnConcepts[source.id]
    conceptIds.sort((a, b) => Number(b === preferred) - Number(a === preferred))
  }
  const mapped = conceptIds.flatMap(conceptId => {
    const prompt = conceptPrompts.find(p => p.conceptId === conceptId)
    const concept = concepts.find(c => c.id === conceptId)
    if (!prompt || !concept) return []
    const anchor = section ?? source.provisions.find(p => p.conceptIds.includes(conceptId))
    return [make(kind, id, conceptId, audience, {
      context: `${context} · ${concept.name}`, text: prompt.questions[audience],
      basis: anchor?.summary ?? source.summary,
      why: `The Atlas connects this ${section ? 'section' : 'source'} with ${concept.name.toLowerCase()}. ${prompt.why}`,
      askFor: prompt.askFor, followUp: prompt.followUp, sources: sourceRefs(source, anchor),
    })]
  }).slice(0, curated ? 1 : 2)
  const targeted = curated ? [make(kind, id, 'focus', audience, {
    context, text: curated[audience], basis: source.summary,
    why: `This question explores the implications of ${source.shortTitle} for the organisation’s AI use. ${source.authorityNote}`,
    askFor: `The relevant assessment and decisions for ${source.shortTitle}, with named owners, supporting records and unresolved findings.`,
    followUp: roles('Which gap needs the board’s attention rather than routine management action?', 'What remains untested or unowned, and when will it be addressed?', 'Which part of the organisation’s account is least supported by evidence?', 'Which part of management\'s account could we not re-perform or corroborate with independent evidence?')[audience],
    sources: sourceRefs(source),
  })] : []
  return [...targeted, ...mapped, scopeQuestion(source, audience, section)]
}

function questionsForRisk(id: string, audience: Audience): Question[] {
  const risk = riskSubdomains.find(r => r.id === id)
  const prompt = riskQuestions[id]
  if (!risk || !prompt) return []
  const sources = [{ title: `MIT AI Risk Repository · ${risk.ref}`, url: MIT_RISK_SOURCE_URL }]
  const concept = conceptPrompts.find(p => risk.conceptIds.includes(p.conceptId))
  return [make('risk-subdomain', id, 'exposure', audience, {
    context: risk.name, text: prompt[audience], basis: risk.definition,
    why: 'A documented risk is a reason to investigate a plausible scenario. Its frequency in the repository does not establish exposure or severity in this organisation.',
    askFor: `A scenario for ${risk.name.toLowerCase()}, identifying affected people or services, relevant AI uses, assumptions and observed evidence.`,
    followUp: 'Which assumption matters most, and what observation would change the assessment?', sources,
  }), make('risk-subdomain', id, 'response', audience, {
    context: risk.name, text: roles('Who owns our response to this risk, and what would cause us to change course?', 'How would we detect this risk becoming an incident, and who could intervene?', 'What evidence supports the proposed response, and what uncertainty remains?', 'What evidence shows the response to this risk operated over the period, not just that it was designed?')[audience],
    basis: risk.definition,
    why: 'A risk-to-control link suggests a response to examine. The organisation still needs to decide relevance, test its response and address gaps.',
    askFor: `${concept?.askFor ?? 'The scenario assessment and supporting observations.'} Include the response owner, escalation triggers and results of any relevant tests.`,
    followUp: 'What happens if the proposed safeguard fails or the warning signal arrives too late?', sources,
  })]
}
function questionsForControl(id: string, audience: Audience): Question[] {
  const control = controlObjectives.find(c => c.id === id)
  const prompt = controlQuestions[id]
  if (!control || !prompt) return []
  const sources = control.sourceRefs.filter((ref, index, refs) => refs.findIndex(r => r.url === ref.url) === index).slice(0, 3).map(ref => ({ title: `${ref.sourceTitle} · ${ref.locator}`, url: ref.url }))
  return [make('control-objective', id, 'practice', audience, {
    context: control.name, text: prompt[audience], basis: control.objective,
    why: control.purpose,
    askFor: `Examples to examine: ${control.evidenceExamples.join('; ')}. Check what the records demonstrate, including failures and gaps.`,
    followUp: 'When did this practice last fail a test or require an exception, and what changed afterwards?', sources,
  }), make('control-objective', id, 'ownership', audience, {
    context: control.name, text: roles('Who is answerable for this control, and how do unresolved failures reach us?', 'Who operates, tests and repairs this control when the system or its use changes?', 'How are responsibility, exceptions and independent challenge evidenced for this control?', 'What evidence shows this control operated over the period, and who independently tested it?')[audience],
    basis: control.objective,
    why: `Possible responsibilities include ${control.roleArchetypes.join(', ')}. Named people still need sufficient authority and resources to act.`,
    askFor: `The ownership and exception records for ${control.shortName.toLowerCase()}, plus recent results from the ${control.lifecycleStages.join(', ').toLowerCase()} stages that apply.`,
    followUp: 'Which unresolved issue has no clear owner, deadline or retest?', sources,
  })]
}

export function questionsForNode(kind: GraphNodeKind, id: string, audience: Audience): Question[] {
  switch (kind) {
    case 'use-case': { const item=useCaseById.get(id);return item?[useCaseQuestion(item,audience)]:[] }
    case 'incident': { const item=incidentById.get(id);return item?[incidentQuestion(item,audience)]:[] }
    case 'concept': case 'domain': return questionsForContext(kind, id, audience)
    case 'instrument': {
      const source = instruments.find(s => s.id === id)
      return source ? questionsForSource(source, audience) : []
    }
    case 'provision': {
      const source = instruments.find(s => s.provisions.some(p => p.id === id))
      const section = source?.provisions.find(p => p.id === id)
      return source && section ? questionsForSource(source, audience, section) : []
    }
    case 'risk-subdomain': return questionsForRisk(id, audience)
    case 'risk-domain': return riskDomains.some(r => r.id === id) ? riskSubdomains.filter(r => r.riskDomainId === id).slice(0, 3).flatMap(r => questionsForRisk(r.id, audience).slice(0, 1)) : []
    case 'control-objective': return questionsForControl(id, audience)
    case 'control-family': return controlFamilies.some(f => f.id === id) ? controlObjectives.filter(c => c.familyId === id).slice(0, 3).flatMap(c => questionsForControl(c.id, audience).slice(0, 1)) : []
  }
}

// The complete set is also used by the ingestion coverage check. No view-specific allowlist.
export const questionNodes: { kind: GraphNodeKind; id: string }[] = [
  ...useCases.map(i=>({kind:'use-case' as const,id:i.id})),
  ...incidents.map(i=>({kind:'incident' as const,id:i.id})),
  ...domains.map(d => ({ kind: 'domain' as const, id: d.id })),
  ...concepts.map(c => ({ kind: 'concept' as const, id: c.id })),
  ...instruments.flatMap(s => [{ kind: 'instrument' as const, id: s.id }, ...s.provisions.map(p => ({ kind: 'provision' as const, id: p.id }))]),
  ...riskDomains.map(r => ({ kind: 'risk-domain' as const, id: r.id })),
  ...riskSubdomains.map(r => ({ kind: 'risk-subdomain' as const, id: r.id })),
  ...controlFamilies.map(f => ({ kind: 'control-family' as const, id: f.id })),
  ...controlObjectives.map(c => ({ kind: 'control-objective' as const, id: c.id })),
]
