import { audiences, conceptPrompts, developmentPrompts, questionForDevelopment, type Question } from '../data/leadershipQuestions'
import { concepts } from '../data/concepts'
import { developments } from '../data/developments'
import { instruments } from '../data/instruments'
import { questionNodes, questionsForNode } from '../data/nodeQuestions'
import { controlQuestions, riskQuestions, sourceQuestions } from '../data/nodeQuestionPrompts'
import { controlObjectives } from '../data/controls'
import { riskSubdomains } from '../data/mitRiskTaxonomy'

export function questionCoverageIssues(): string[] {
  const issues: string[] = []
  const inspect = (context: string, questions: Question[], minimum: number) => {
    if (questions.length < minimum || questions.length > 3) issues.push(`${context}: expected ${minimum}–3 questions, got ${questions.length}`)
    if (new Set(questions.map(q => q.id)).size !== questions.length || new Set(questions.map(q => q.text)).size !== questions.length) issues.push(`${context}: duplicate questions`)
    for (const q of questions) {
      if (![q.context, q.text, q.why, q.askFor, q.followUp].every(value => value?.trim())) issues.push(`${context}: incomplete prompt ${q.id}`)
      if (!q.sources.length || q.sources.some(s => !s.title.trim() || !/^https:\/\//.test(s.url))) issues.push(`${context}: missing reference ${q.id}`)
    }
  }
  for (const node of questionNodes) {
    const sets = audiences.map(role => questionsForNode(node.kind, node.id, role))
    sets.forEach((qs, index) => inspect(`${node.kind}:${node.id}:${audiences[index]}`, qs, 2))
    if (new Set(sets.map(qs => qs.map(q => q.text).join('\n'))).size !== audiences.length) issues.push(`${node.kind}:${node.id}: missing role distinctions`)
  }
  for (const item of developments) for (const role of audiences) {
    const q = questionForDevelopment(item, role)
    inspect(`development:${item.id}:${role}`, q ? [q] : [], 1)
    if (!developmentPrompts[item.id]?.questions[role]) issues.push(`development:${item.id}: missing ${role} prompt`)
  }
  for (const c of concepts) if (!conceptPrompts.some(p => p.conceptId === c.id)) issues.push(`concept:${c.id}: missing authored prompts`)
  for (const r of riskSubdomains) if (!riskQuestions[r.id]) issues.push(`risk:${r.id}: missing authored prompts`)
  for (const c of controlObjectives) if (!controlQuestions[c.id]) issues.push(`control:${c.id}: missing authored prompts`)
  for (const id of Object.keys(sourceQuestions)) if (!instruments.some(s => s.id === id)) issues.push(`source:${id}: orphaned authored prompts`)
  return issues
}
