import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Ratchet: legacy CSS may shrink but never grow. Lower these ceilings as screens are rebuilt.
const ceilings = { important: 84, hex: 433, rules: 1444 }
const legacyDir = join(__dirname, 'legacy')
const legacy = readdirSync(legacyDir).filter((file) => file.endsWith('.css')).map((file) => readFileSync(join(legacyDir, file), 'utf8')).join('\n')

describe('legacy stylesheet ratchet', () => {
  it('does not add !important, raw hex colours or rules to legacy CSS', () => {
    expect((legacy.match(/!important/g) ?? []).length).toBeLessThanOrEqual(ceilings.important)
    expect((legacy.match(/#[0-9a-f]{3,8}\b/gi) ?? []).length).toBeLessThanOrEqual(ceilings.hex)
    expect((legacy.match(/\{/g) ?? []).length).toBeLessThanOrEqual(ceilings.rules)
  })

  it('keeps every legacy file inside the legacy cascade layer', () => {
    for (const file of readdirSync(legacyDir).filter((name) => name.endsWith('.css'))) {
      expect(readFileSync(join(legacyDir, file), 'utf8'), file).toMatch(/^\/\*[^]*?\*\/\n@layer legacy \{/)
    }
  })
})
