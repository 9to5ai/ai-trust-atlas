import { readFileSync, writeFileSync } from 'node:fs'
import { instruments } from '../src/data/instruments'
import { assessLedger, type Candidate } from '../src/lib/sourcing'
import { sourcingPolicy } from '../src/data/sourcingPolicy'
import register from '../research/sourcing/discovery-register.json'

const command = process.argv[2] ?? 'status'
const ledger = JSON.parse(readFileSync('research/sourcing/candidate-decisions.json', 'utf8')) as Candidate[]
const assessments = assessLedger(ledger)
for (const candidate of ledger) for (const id of candidate.linkedSourceIds) {
  if (!instruments.some(source => source.id === id)) throw new Error(`Unknown linked source: ${id}`)
}
const today = new Date().toISOString().slice(0, 10)
const due = (item: { lastReviewed: string | null; cadence: string }) => !item.lastReviewed || (Date.parse(today) - Date.parse(item.lastReviewed)) / 86400000 >= (item.cadence === 'monthly' ? 28 : 7)
const checklist = [
  ...instruments.map(source => ({ id: `source:${source.id}`, title: source.shortTitle, url: source.officialUrl, scope: source.detailAvailability === 'full-public-text' ? 'public source content and status' : 'public metadata and overview only; full text not assessed' })),
  ...register.publishers.filter(due).map(p => ({ id: `publisher:${p.id}`, title: p.name, url: p.url, scope: p.expectedScope })),
  ...register.topicSearches.filter(due).map(t => ({ id: `topic:${t.id}`, title: t.topic, query: t.query, scope: 'discover original evidence, including publishers outside the register' })),
].map(item => ({ ...item, result: 'not reviewed', reviewed: null, reviewer: '', evidenceUrls: [], note: '', candidateIds: [] }))
if (command === 'init') {
  const output = process.argv[3]
  if (!output) throw new Error('Provide a new run file path: npm run sources:review -- init research/sourcing/run-YYYY-MM-DD.json')
  writeFileSync(output, JSON.stringify({ policyVersion: sourcingPolicy.version, created: today, status: 'INCOMPLETE', items: checklist }, null, 2) + '\n', { flag: 'wx' })
  console.log(`Created ${checklist.length} unreviewed checks. No sources fetched or assessed.`)
} else if (command === 'check') {
  const file = process.argv[3]
  if (!file) throw new Error('Provide a run file to check')
  const run = JSON.parse(readFileSync(file, 'utf8'))
  if (run.policyVersion !== sourcingPolicy.version || !Array.isArray(run.items)) throw new Error('Invalid run or outdated policy')
  const ids = new Set<string>()
  for (const item of run.items) {
    if (ids.has(item.id)) throw new Error(`Duplicate check: ${item.id}`)
    ids.add(item.id)
    if (!['changed', 'unchanged', 'not reviewed'].includes(item.result)) throw new Error(`Invalid result: ${item.id}`)
    if (item.result !== 'not reviewed' && (!item.reviewed || !item.reviewer || !item.evidenceUrls?.length || !item.note)) throw new Error(`Missing review evidence: ${item.id}`)
    for (const id of item.candidateIds ?? []) if (!ledger.some(candidate => candidate.id === id)) throw new Error(`Unlogged candidate: ${id}`)
  }
  const missing = checklist.filter(item => !ids.has(item.id))
  const unreviewed = run.items.filter((item: { result: string }) => item.result === 'not reviewed')
  const complete = !missing.length && !unreviewed.length
  console.log(JSON.stringify({ status: complete ? 'COMPLETE' : 'INCOMPLETE', missing: missing.map(item => item.id), unreviewed: unreviewed.length, assessments }, null, 2))
  if (!complete) process.exitCode = 1
} else if (command === 'status') {
  console.log(JSON.stringify({ policyVersion: sourcingPolicy.version, corpusChecks: instruments.length, dueDiscoveryChecks: checklist.length - instruments.length, candidates: assessments, note: 'Status only. No live review performed; empty ledger means no decisions recorded under this policy yet.' }, null, 2))
} else throw new Error('Use status, init or check')
