import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

/* Fails the build if the first-load bundle or the lazy WebGL chunk grows past its budget. */
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
