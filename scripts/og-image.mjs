// Regenerates public/og.jpg from the running site: npm run build && npx vite preview, then node scripts/og-image.mjs
import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
await page.goto(process.argv[2] ?? 'http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.addStyleTag({ content: '[class*="_searchTrigger_"],[class*="_tourLink_"],[class*="_stats_"]{display:none!important}[class*="_hero_"]{min-height:630px!important}' })
await page.waitForTimeout(2200)
await page.screenshot({ path: 'public/og.png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
await browser.close()
console.log('Wrote public/og.png; convert with: sips -s format jpeg -s formatOptions 82 public/og.png --out public/og.jpg')
