import { domainIds, maturityLevels, stageIds, type DomainId, type Level, type StageId } from './facets'
import type { Corpus, Practice } from './schema'
import type { Answer } from './workspace'

/*
 * Assessment questions come straight from each practice's maturity levels, and scoring is
 * deterministic, so a person in the browser and an agent using the same answers get the same
 * result. These rules are published on the site.
 */
export const scoringRules = [
  'Each practice is rated on four levels: Ad hoc, Defined, Operating and Assured. The level is the highest one whose criteria are all met.',
  'A practice rated Assured by an agent counts as Operating until a named person attests to it. Agents never rate their own work above Operating.',
  'A domain score is the average of the rated practices in that domain, to one decimal place. Unrated practices are left out and shown as coverage.',
  'A matrix cell (domain × lifecycle stage) averages the rated practices tagged with that stage. Practices that span the lifecycle sit in the Organisation-wide column.',
] as const

export type AssessmentQuestion = {
  practiceId: string
  title: string
  domain: DomainId
  question: string
  options: { level: Level; name: string; criteria: string[] }[]
}

export function getAssessmentQuestions(corpus: Corpus, { quick = false, practiceIds }: { quick?: boolean; practiceIds?: string[] } = {}): AssessmentQuestion[] {
  return corpus.practices
    .filter((practice) => (!quick || practice.quick) && (!practiceIds || practiceIds.includes(practice.id)))
    .map((practice) => ({
      practiceId: practice.id,
      title: practice.title,
      domain: practice.domain,
      question: `Which level best describes ${lowerFirst(practice.title)} in your organisation today?`,
      options: practice.maturity.map((entry) => ({ level: entry.level, name: maturityLevels[entry.level - 1].name, criteria: entry.criteria })),
    }))
}

export type PracticeScore = { practiceId: string; level?: Level; capped: boolean }
export type Aggregate = { score?: number; rated: number; total: number; practiceIds: string[] }
export type AssessmentResult = {
  practices: Record<string, PracticeScore>
  domains: Record<DomainId, Aggregate>
  /* Keyed `${domain}|${stage}`. */
  cells: Record<string, Aggregate>
  overall: Aggregate
}

export const effectiveLevel = (answer: Answer | undefined): PracticeScore['level'] =>
  !answer ? undefined : answer.level === 4 && answer.answeredBy === 'agent' && !answer.attestedBy ? 3 : answer.level

export function scoreAssessment(corpus: Corpus, answers: Record<string, Answer>): AssessmentResult {
  const practices: Record<string, PracticeScore> = {}
  for (const practice of corpus.practices) {
    const answer = answers[practice.id]
    const level = effectiveLevel(answer)
    practices[practice.id] = { practiceId: practice.id, level, capped: !!answer && level !== answer.level }
  }
  const aggregate = (members: Practice[]): Aggregate => {
    const rated = members.map((practice) => practices[practice.id].level).filter((level): level is Level => level !== undefined)
    return {
      score: rated.length ? Math.round((rated.reduce((sum, level) => sum + level, 0) / rated.length) * 10) / 10 : undefined,
      rated: rated.length,
      total: members.length,
      practiceIds: members.map((practice) => practice.id),
    }
  }
  const domains = Object.fromEntries(domainIds.map((domain) => [domain, aggregate(corpus.practices.filter((practice) => practice.domain === domain))])) as Record<DomainId, Aggregate>
  const cells: Record<string, Aggregate> = {}
  for (const domain of domainIds) for (const stage of stageIds) {
    const members = corpus.practices.filter((practice) => practice.domain === domain && inStage(practice, stage))
    if (members.length) cells[`${domain}|${stage}`] = aggregate(members)
  }
  return { practices, domains, cells, overall: aggregate(corpus.practices) }
}

export const inStage = (practice: Practice, stage: StageId) => practice.stages.includes(stage)

const lowerFirst = (text: string) => (/^[A-Z][a-z]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text)
