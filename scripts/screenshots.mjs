// Captures reference screenshots of key views: node scripts/screenshots.mjs <label> [baseUrl]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const label = process.argv[2] ?? 'current'
const base = process.argv[3] ?? 'http://127.0.0.1:4173'
const out = `.shots/${label}`
mkdirSync(out, { recursive: true })

const views = [
  ['home', '/'],
  ['universe', '/?mode=ontology'],
  ['selected', '/#/instrument/apra-cps-230'],
  ['list', '/?view=list'],
  ['questions', '/?view=questions'],
  ['use-cases', '/?view=use-cases'],
  ['methodology', '/methodology'],
]
const themes = (process.env.THEMES ?? 'dark,light').split(',')
const browser = await chromium.launch()
for (const theme of themes) {
  for (const [name, path] of views) {
    for (const [device, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
      if (device === 'mobile' && process.env.MOBILE !== '1') continue
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
      await page.addInitScript((t) => { try { localStorage.setItem('atlas-theme', t) } catch {} }, theme)
      await page.goto(base + path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1200)
      await page.screenshot({ path: `${out}/${name}-${theme}-${device}.png` })
      await page.close()
    }
  }
}
await browser.close()
console.log(`saved to ${out}`)
