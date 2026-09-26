import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'
import { z } from 'zod'
import { concepts } from '../../src/data/concepts'
import { controlObjectives } from '../../src/data/controls'
import { instruments } from '../../src/data/instruments'
import { requirements } from '../../src/data/requirements'
import { practiceSchema, sourceSchema, type Practice, type Source } from '../../src/practice/core/schema'
import type { AtlasIdSets } from '../../src/practice/core/validate'

/*
 * Locates the private practice content and loads it. Content is looked for, in order:
 *   1. PRACTICE_CONTENT_DIR (a local checkout of the private repo)
 *   2. a shallow clone of PRACTICE_CONTENT_REPO using PRACTICE_CONTENT_TOKEN (Vercel builds)
 *   3. ../ai-trust-practice-content next to this repo (local development)
 *   4. the synthetic fixture in scripts/practice/fixture (CI without access)
 */
const root = resolve(import.meta.dirname, '../..')
export const buildDir = join(root, '.practice-build')

export function locateContent(): { dir: string; origin: 'env' | 'clone' | 'sibling' | 'fixture' } {
  const fromEnv = process.env.PRACTICE_CONTENT_DIR
  if (fromEnv) return { dir: resolve(fromEnv), origin: 'env' }
  const token = process.env.PRACTICE_CONTENT_TOKEN
  if (token) {
    const target = join(root, '.practice-content')
    rmSync(target, { recursive: true, force: true })
    const repo = process.env.PRACTICE_CONTENT_REPO ?? '9to5ai/ai-trust-practice-content'
    const ref = process.env.PRACTICE_CONTENT_REF ?? 'main'
    try {
      execFileSync('git', ['clone', '--quiet', '--depth', '1', '--branch', ref, `https://x-access-token:${token}@github.com/${repo}.git`, target], { stdio: 'pipe' })
    } catch {
      // Never echo git's error: it can contain the tokenised URL.
      throw new Error(`Could not clone the practice content repository ${repo}@${ref}. Check PRACTICE_CONTENT_TOKEN.`)
    }
    return { dir: target, origin: 'clone' }
  }
  const sibling = resolve(root, '../ai-trust-practice-content')
  if (!process.env.VERCEL && existsSync(join(sibling, 'practices'))) return { dir: sibling, origin: 'sibling' }
  return { dir: join(import.meta.dirname, 'fixture'), origin: 'fixture' }
}

const describe = (error: z.ZodError) => error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('; ')

export function loadContent(dir: string) {
  const errors: string[] = []
  const rawSources = parse(readFileSync(join(dir, 'sources.yaml'), 'utf8')) as unknown
  const sources: Source[] = []
  for (const [index, raw] of (Array.isArray(rawSources) ? rawSources : []).entries()) {
    const result = sourceSchema.safeParse(raw)
    if (result.success) sources.push(result.data)
    else errors.push(`sources.yaml #${index + 1} (${(raw as { id?: string })?.id ?? '?'}): ${describe(result.error)}`)
  }
  const practices: Practice[] = []
  const files = readdirSync(join(dir, 'practices')).filter((file) => file.endsWith('.yaml')).sort()
  for (const file of files) {
    const result = practiceSchema.safeParse(parse(readFileSync(join(dir, 'practices', file), 'utf8')))
    if (!result.success) { errors.push(`${file}: ${describe(result.error)}`); continue }
    if (`${result.data.id}.yaml` !== file) errors.push(`${file}: file name must match its ID (${result.data.id}.yaml)`)
    practices.push(result.data)
  }
  return { practices, sources, errors }
}

export const atlasIdSets = (): AtlasIdSets => ({
  controls: new Set(controlObjectives.map((control) => control.id)),
  sections: new Set(instruments.flatMap((instrument) => instrument.provisions.map((provision) => provision.id))),
  sources: new Set(instruments.map((instrument) => instrument.id)),
  concepts: new Set(concepts.map((concept) => concept.id)),
  requirements: new Set(requirements.map((requirement) => requirement.id)),
})
