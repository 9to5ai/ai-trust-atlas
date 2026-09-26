/*
 * Prints sources.yaml entries for Atlas sources, so practice citations reuse the Atlas's titles,
 * URLs and verification dates. Usage: npx vite-node scripts/practice/atlas-sources.ts <atlas source id...>
 */
import { instruments } from '../../src/data/instruments'

const regulator = /Authority|Commission|Commissioner|Regulation Authority|Superintendent|Federal Reserve|OCC|FDIC|Monetary Authority|Supervisors|Board$|Information Commissioner|Conduct Authority|Financial Services (Agency|Commission)/i
const kind = (authorityClass: string, issuer: string) => {
  if (authorityClass === 'law' || authorityClass === 'treaty') return 'law'
  if (authorityClass === 'standard' || authorityClass === 'assurance-standard') return 'standard'
  if (authorityClass === 'framework' || authorityClass === 'testing-tool') return 'framework'
  if (authorityClass === 'research-database') return 'research'
  return regulator.test(issuer) ? 'regulator-guidance' : 'government-guidance'
}
const quote = (value: string) => (/^[0-9.]+$|[:#,\[\]{}&*!|>'"%@`]|^\s|\s$/.test(value) ? JSON.stringify(value) : value)

for (const id of process.argv.slice(2)) {
  const source = instruments.find((instrument) => instrument.id === id)
  if (!source) { console.error(`# unknown Atlas source ${id}`); continue }
  console.log([
    `- id: ${source.id}`,
    `  title: ${quote(source.title)}`,
    `  short: ${quote(source.shortTitle)}`,
    `  publisher: ${quote(source.issuer)}`,
    `  url: ${source.officialUrl}`,
    `  kind: ${kind(source.authorityClass, source.issuer)}`,
    `  jurisdiction: ${quote(source.jurisdiction)}`,
    ...(source.published ? [`  published: ${quote(String(source.published))}`] : []),
    `  lastVerified: ${source.lastVerified.slice(0, 10)}`,
    `  atlasSource: ${source.id}`,
  ].join('\n'))
}
