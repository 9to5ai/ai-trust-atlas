import { readFileSync } from 'node:fs'
import { CitationFilter, conclusiveLanguage } from '../api/_lib/citations'
import { retrieve } from '../api/_lib/corpus'
import { selectProvider } from '../api/_lib/llm'

/*
 * Evaluates Ask the Atlas against research/ask/golden.json.
 * Always checks retrieval recall; with GEMINI_API_KEY (or Vertex) configured it
 * also generates answers and checks citations and forbidden language.
 * Never run in PR CI: it can spend model tokens.
 */
type Case = { question: string; expect: string[]; forbidden?: string[] }
const { cases } = JSON.parse(readFileSync(new URL('../research/ask/golden.json', import.meta.url), 'utf8')) as { cases: Case[] }
const provider = selectProvider()
let failures = 0

for (const item of cases) {
  const records = retrieve(item.question)
  const ids = records.map((record) => record.id)
  const recalled = item.expect.length === 0 || item.expect.some((id) => ids.includes(id))
  let verdict = recalled ? 'retrieval ok' : `retrieval MISSED ${item.expect.join(' | ')}`
  if (!recalled) failures++
  if (provider.name !== 'demo' && records.length) {
    const filter = new CitationFilter(new Set(ids))
    let answer = ''
    for await (const part of provider.stream(item.question, records, [])) if (part.text) answer += filter.push(part.text)
    answer += filter.flush()
    const problems = [
      filter.cited.size === 0 && item.expect.length ? 'no citations' : '',
      filter.dropped.size ? `invented ids: ${[...filter.dropped].join(', ')}` : '',
      conclusiveLanguage.test(answer) ? 'conclusive language' : '',
      ...(item.forbidden ?? []).filter((phrase) => answer.toLowerCase().includes(phrase)).map((phrase) => `forbidden "${phrase}"`),
    ].filter(Boolean)
    if (problems.length) failures++
    verdict += problems.length ? ` · ANSWER: ${problems.join('; ')}` : ` · answer ok (${filter.cited.size} citations)`
  }
  console.log(`${recalled ? '✓' : '✗'} ${item.question}\n    ${verdict}`)
}
console.log(`\n${cases.length - failures}/${cases.length} passed using ${provider.name === 'demo' ? 'retrieval only (no model configured)' : `${provider.name} · ${provider.model}`}.`)
process.exit(failures ? 1 : 0)
