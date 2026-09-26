import { randomBytes } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'
import { z } from 'zod'
import { practiceSchema, type Corpus } from '../../src/practice/core/schema'
import { citedSourceIds, qualityGaps, validateCorpus } from '../../src/practice/core/validate'
import { atlasIdSets, buildDir, loadContent, locateContent } from './content'

/*
 * Compiles the private practice content into .practice-build/, which only the gated
 * serverless functions read. Nothing here is written to dist/.
 *
 *   vite-node scripts/practice/build-corpus.ts            build
 *   vite-node scripts/practice/build-corpus.ts --check    validate and report the review backlog only
 *   … --content <dir>                                      use a specific content checkout
 */
const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const contentArg = args.indexOf('--content')
if (contentArg >= 0) process.env.PRACTICE_CONTENT_DIR = resolve(args[contentArg + 1])

const { dir, origin } = locateContent()
const { practices, sources, errors: parseErrors } = loadContent(dir)
const { errors, warnings } = validateCorpus(practices, sources, atlasIdSets())
const problems = [...parseErrors, ...errors.map((finding) => `${finding.practice ? `${finding.practice}: ` : ''}${finding.message}`)]
for (const warning of warnings) console.warn(`warning: ${warning.practice ?? ''} ${warning.message}`)
if (problems.length) {
  console.error(`Practice content failed validation (${origin}: ${dir}):\n- ${problems.join('\n- ')}`)
  process.exit(1)
}

const byStatus = (status: string) => practices.filter((practice) => practice.status === status).length
const backlog = practices.filter((practice) => practice.status !== 'approved').map((practice) => `${practice.id} (${practice.status}): ${qualityGaps(practice).join('; ') || 'ready for approval'}`)
console.log(`Practice content (${origin}): ${practices.length} practices — ${byStatus('approved')} approved, ${byStatus('under-review')} under review, ${byStatus('draft')} draft; ${sources.length} sources.`)
if (checkOnly) {
  if (backlog.length) console.log(`Awaiting approval:\n  ${backlog.join('\n  ')}`)
  process.exit(0)
}

// Production serves approved practices only; previews and local builds include drafts.
const includesDrafts = process.env.PRACTICE_INCLUDE_DRAFTS === '1' || (process.env.VERCEL_ENV ?? 'development') !== 'production'
const published = practices.filter((practice) => includesDrafts || practice.status === 'approved').sort((a, b) => a.id.localeCompare(b.id))
const cited = new Set(published.flatMap((practice) => [...citedSourceIds(practice)]))
const release = z.object({ version: z.string().regex(/^\d{4}\.\d{1,2}\.\d+$/) }).parse(parse(readFileSync(join(dir, 'release.yaml'), 'utf8')))

const corpus: Corpus = {
  schemaVersion: 1,
  version: release.version,
  generatedAt: new Date().toISOString(),
  buildId: `atp-canary-${randomBytes(12).toString('hex')}`,
  includesDrafts,
  practices: published,
  sources: sources.filter((source) => cited.has(source.id)),
}

/* Atlas node ID → the practices that serve it, for the traversal markers shown to people with access. */
const atlasIndex: Record<string, { id: string; title: string }[]> = {}
const mark = (nodeId: string, practice: { id: string; title: string }) => {
  const list = (atlasIndex[nodeId] ??= [])
  if (!list.some((item) => item.id === practice.id)) list.push({ id: practice.id, title: practice.title })
}
for (const practice of published) {
  for (const id of practice.atlas.controls) mark(`control-objective:${id}`, practice)
  for (const id of practice.atlas.sections) mark(`provision:${id}`, practice)
  for (const id of practice.atlas.sources) mark(`instrument:${id}`, practice)
  for (const id of practice.atlas.concepts) mark(`concept:${id}`, practice)
}

rmSync(buildDir, { recursive: true, force: true })
mkdirSync(join(buildDir, 'practices'), { recursive: true })
const write = (file: string, content: string) => writeFileSync(join(buildDir, file), content)
write('corpus.json', JSON.stringify(corpus))
write('schema.json', JSON.stringify(z.toJSONSchema(practiceSchema, { io: 'input' }), null, 2))
write('atlas-index.json', JSON.stringify(atlasIndex))
for (const practice of published) write(`practices/${practice.id}.json`, JSON.stringify(practice, null, 2))
// Strings that must never appear in the public bundle: the build ID and every practice's purpose.
write('canaries.txt', [corpus.buildId, ...published.map((practice) => practice.purpose.slice(0, 80))].join('\n'))
console.log(`Wrote .practice-build/ for corpus ${corpus.version} with ${published.length} practices${includesDrafts ? ' (drafts included)' : ''}.`)
