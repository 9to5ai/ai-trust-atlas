import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

/*
 * Fails the build if the first-load bundle or the lazy WebGL chunk grows past its budget,
 * or if any gated practice text (see .practice-build/canaries.txt) reached the public dist/.
 */
const dist = join(import.meta.dirname, '../dist')
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const initial = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map((match) => match[1])
const gz = (file: string) => gzipSync(readFileSync(join(dist, file))).length
const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`
const firstLoad = initial.reduce((total, file) => total + gz(file), 0)
const webgl = readdirSync(join(dist, 'assets')).filter((file) => file.startsWith('WebGLUniverse') && file.endsWith('.js')).reduce((total, file) => total + gz(`assets/${file}`), 0)
const budgets = { firstLoad: 380 * 1024, webgl: 190 * 1024 }
console.log(`First load: ${kb(firstLoad)} gzip across ${initial.length} files (budget ${kb(budgets.firstLoad)}). WebGL universe: ${kb(webgl)} (budget ${kb(budgets.webgl)}).`)
if (firstLoad > budgets.firstLoad || webgl > budgets.webgl) { console.error('Bundle budget exceeded.'); process.exit(1) }

const canaryFile = join(import.meta.dirname, '../.practice-build/canaries.txt')
if (existsSync(canaryFile)) {
  const canaries = readFileSync(canaryFile, 'utf8').split('\n').filter((line) => line.length >= 20)
  const files = readdirSync(dist, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => join(entry.parentPath, entry.name))
  const leaks = files.flatMap((file) => { const content = readFileSync(file, 'utf8'); return canaries.filter((canary) => content.includes(canary)).map((canary) => `${file.slice(dist.length + 1)}: ${canary.slice(0, 40)}…`) })
  if (leaks.length) { console.error(`Gated practice content found in dist/:\n- ${leaks.join('\n- ')}`); process.exit(1) }
  console.log(`Practice gate: no gated text in ${files.length} public files.`)
}
