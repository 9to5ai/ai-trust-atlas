/*
 * Lists valid Atlas IDs for authors and agents: concepts, domains, controls, risks,
 * sources (optionally with sections), developments, use cases, incidents and
 * authored source prompts. Usage: npx vite-node scripts/atlas-ids.ts [concepts|controls|risks|sources|sections <id...>|developments|cases|incidents|source-prompts]
 */
import { concepts, domains } from '../src/data/concepts'
import { controlObjectives } from '../src/data/controls'
import { riskSubdomains } from '../src/data/mitRiskTaxonomy'
import { instruments } from '../src/data/instruments'
import { developments } from '../src/data/developments'
import { useCases } from '../src/data/useCases'
import { incidents } from '../src/data/incidents'
import { sourceQuestions } from '../src/data/nodeQuestionPrompts'

const [what = 'concepts', ...ids] = process.argv.slice(2)
const print = (rows: string[]) => console.log(rows.join('\n'))
if (what === 'concepts') print([...domains.map((d) => `domain ${d.id} (${d.role}): ${d.name}`), ...concepts.map((c) => `${c.id} [${c.domainId}, ${c.role}]: ${c.name} — ${c.definition}`)])
if (what === 'controls') print(controlObjectives.map((c) => `${c.id} (${c.code}): ${c.name} — ${c.objective}`))
if (what === 'risks') print(riskSubdomains.map((r) => `${r.id} (${r.ref}): ${r.name}`))
if (what === 'sources') print(instruments.map((s) => `${s.id} [${s.region}; ${s.legalEffect}]: ${s.shortTitle} — ${s.provisions.length} sections`))
if (what === 'sections') for (const id of ids) { const s = instruments.find((x) => x.id === id); console.log(s ? `${s.id}: ${s.title} <${s.officialUrl}>\n${s.provisions.map((p) => `  ${p.id} | ${p.ref} | ${p.title} | concepts: ${p.conceptIds.join(', ')}`).join('\n')}` : `${id}: not found`) }
if (what === 'developments') print(developments.map((d) => `${d.id}: ${d.title}`))
if (what === 'cases') print(useCases.map((u) => `${u.id}: ${u.company} · ${u.title}`))
if (what === 'incidents') print(incidents.map((i) => `${i.id}: ${i.title}`))
if (what === 'source-prompts') print(Object.keys(sourceQuestions))
