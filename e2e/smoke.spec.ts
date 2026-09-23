import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const routes = [
  { path: '/', heading: /The map of/ },
  { path: '/universe', label: /Interactive orbital map/ },
  { path: '/questions', region: 'Questions workspace' },
  { path: '/cases', heading: /See how the work is changing/ },
  { path: '/methodology', heading: 'How the Atlas is curated' },
  { path: '/library', heading: 'Every source, one shelf' },
  { path: '/library/eu-ai-act', heading: 'EU AI Act' },
  { path: '/library/compare?ids=apra-cps-230,eu-dora', heading: /Shared themes/ },
  { path: '/crosswalk', heading: /One control/ },
  { path: '/crosswalk/impact-risk-assessment', heading: 'Assess impacts and risks' },
  { path: '/horizon', heading: /What’s coming/ },
  { path: '/assess', heading: /Readiness/ },
  { path: '/ask', heading: /Questions, answered/ },
  { path: '/implement', heading: /From obligation to operating control/ },
  { path: '/implement/agentic-guardrails', heading: /runtime guardrails/ },
]

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}

for (const route of routes) {
  test(`${route.path} renders without runtime errors`, async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto(route.path)
    if (route.heading) await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()
    if (route.label) await expect(page.getByLabel(route.label)).toBeAttached()
    if (route.region) await expect(page.getByRole('region', { name: route.region })).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('legacy shared links land on the matching page', async ({ page }) => {
  await page.goto('/?view=questions')
  await expect(page).toHaveURL(/\/questions$|\/questions\?/)
  await page.goto('/#/instrument/apra-cps-230')
  await expect(page).toHaveURL(/\/universe(\?[^#]*)?#\/instrument\/apra-cps-230$/)
  await expect(page.getByLabel('Selected node details')).toContainText('APRA CPS 230')
})

test('section navigation and browser Back work without reloads', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) await page.getByRole('button', { name: 'Open sections menu' }).click()
  await page.getByRole('navigation', { name: 'Atlas sections' }).getByRole('link', { name: 'Methodology' }).click()
  await expect(page).toHaveURL(/\/methodology$/)
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1, name: /The map of/ })).toBeVisible()
})

test('theme choice persists across visits', async ({ page }) => {
  await page.goto('/methodology')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

for (const theme of ['dark', 'light']) {
  for (const path of ['/', '/methodology', '/library', '/crosswalk', '/horizon', '/assess', '/ask', '/implement']) {
    test(`${path} has no serious accessibility violations in the ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('atlas-theme', value), theme)
      await page.goto(path)
      await page.waitForTimeout(1200)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      expect(serious.map((violation) => `${violation.id}: ${violation.nodes.slice(0, 3).map((node) => node.target.join(' ')).join(', ')}`)).toEqual([])
    })
  }
}

test.describe('WebGL universe', () => {
  test.skip(({ isMobile }) => isMobile, 'Covered on desktop')
  test('renders the observatory and selects nodes from the keyboard', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/universe')
    const stage = page.locator('.universe-webgl')
    await expect(stage).toBeVisible()
    await page.waitForTimeout(1500)
    const canvas = stage.locator('canvas')
    // A blank frame compresses to almost nothing; a rendered constellation does not.
    const image = await canvas.screenshot()
    expect(image.length).toBeGreaterThan(40_000)
    await canvas.focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByLabel('Selected node details')).toBeVisible()
    await expect(page.locator('.universe-label[data-state="selected"]')).toBeVisible()
    expect(errors.filter((message) => !message.includes('GL Driver'))).toEqual([])
  })
  test('keeps a single render loop once ambient rotation starts', async ({ page }) => {
    await page.addInitScript(() => {
      const probe = { clears: 0, frames: new Set<number>() }
      ;(window as unknown as { __probe: typeof probe }).__probe = probe
      const clear = WebGL2RenderingContext.prototype.clear
      WebGL2RenderingContext.prototype.clear = function (mask: number) { probe.clears++; return clear.call(this, mask) }
      const raf = window.requestAnimationFrame.bind(window)
      window.requestAnimationFrame = (callback) => raf((time) => { probe.frames.add(time); callback(time) })
    })
    await page.goto('/universe')
    await page.waitForTimeout(7500)
    const perFrame = await page.evaluate(async () => {
      const probe = (window as unknown as { __probe: { clears: number; frames: Set<number> } }).__probe
      probe.clears = 0; probe.frames.clear()
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return probe.clears / Math.max(1, probe.frames.size)
    })
    // A single loop clears a fixed handful of targets per frame (scene plus bloom passes); duplicate loops multiply it.
    expect(perFrame).toBeLessThan(25)
  })
  test('falls back to the 2D map on request', async ({ page }) => {
    await page.goto('/universe?renderer=2d')
    await expect(page.locator('.universe-webgl')).toHaveCount(0)
    await expect(page.getByLabel(/Interactive orbital map/)).toBeVisible()
  })
})

test('Ask the Atlas streams a cited answer', async ({ page, isMobile }) => {
  await page.route('**/api/ask', (route) => route.fulfill({
    status: 200,
    headers: { 'content-type': 'text/event-stream' },
    body: [
      ['meta', { provider: 'gemini', model: 'gemini-test', records: [{ id: 'instrument:apra-cps-230', title: 'APRA CPS 230', kind: 'Source', draft: false }] }],
      ['delta', { text: 'CPS 230 sets expectations for material service providers [[instrument:apra-cps-230]].' }],
      ['done', { cited: ['instrument:apra-cps-230'], dropped: [], uncited: false, conclusiveLanguage: false }],
    ].map(([event, data]) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`).join(''),
  }))
  await page.goto('/')
  if (isMobile) await page.goto('/ask')
  else await page.getByRole('button', { name: 'Ask the Atlas' }).click()
  await page.getByLabel('Your question').fill('What does CPS 230 say about service providers?')
  await page.getByRole('button', { name: 'Ask', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Source 1: APRA CPS 230' })).toBeVisible()
  await page.getByRole('link', { name: 'Source 1: APRA CPS 230' }).click()
  await expect(page).toHaveURL(/\/library\/apra-cps-230$/)
})

test('assessment example exports a board pack and a workbook', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Downloads covered on desktop')
  await page.goto('/assess')
  await page.getByRole('button', { name: /Load an example/ }).click()
  await expect(page.getByRole('heading', { name: 'Priority gaps' })).toBeVisible()
  const [pptx] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Board pack/ }).click()])
  expect(pptx.suggestedFilename()).toMatch(/board-pack\.pptx$/)
  const [xlsx] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Workbook/ }).click()])
  expect(xlsx.suggestedFilename()).toMatch(/assessment\.xlsx$/)
})
