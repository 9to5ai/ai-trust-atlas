import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { shareablePages } from '../src/app/pageMeta'

/*
 * Writes a copy of dist/index.html for each shareable page with its own
 * <title>, description and Open Graph tags, so links unfurl well and search
 * engines see meaningful metadata. The app still boots as the same SPA.
 */
const dist = join(import.meta.dirname, '../dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

for (const [path, meta] of Object.entries(shareablePages)) {
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escape(meta.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
  // /library/eu-ai-act → dist/library/eu-ai-act.html, which Vercel serves at the clean URL.
  const file = join(dist, `${path.slice(1)}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}
console.log(`Prerendered page heads for ${Object.keys(shareablePages).length} routes.`)
