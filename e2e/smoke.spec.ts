import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const routes = [
  { path: '/universe', label: /Interactive orbital map/ },
  { path: '/questions', region: 'Questions workspace' },
  { path: '/cases', heading: /See how the work is changing/ },
]

test('Medicare incident shared link opens evidence and role questions', async ({ page, isMobile }) => {
  await page.goto('/universe?incidents=1#/incident/openai-medicare-2026')
  if (isMobile) await page.getByRole('button', { name: /Medicare statistics portal Read details/ }).click()
  const details = page.getByLabel('Selected node details')
  await expect(details).toContainText('Medicare statistics portal')
  await expect(details).toContainText('18 June 2026')
  await expect(details).toContainText('Government public disclosure')
  await details.getByText('Sources and limits', { exact: true }).click()
  await expect(details.getByRole('link', { name: /Marles and Gallagher/ })).toHaveAttribute('href', 'https://www.minister.defence.gov.au/transcripts/2026-09-24/press-conference-sydney')
})

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

test('retired pages open the Universe', async ({ page }) => {
  await page.goto('/library/apra-cps-230')
  await expect(page).toHaveURL(/\/universe(\?[^#]*)?#\/instrument\/apra-cps-230$/)
  await page.goto('/ask')
  await expect(page).toHaveURL(/\/universe/)
})

test('legacy shared links land on the matching page', async ({ page }) => {
  await page.goto('/?view=questions')
  await expect(page).toHaveURL(/\/questions$|\/questions\?/)
  await page.goto('/#/instrument/apra-cps-230')
  await expect(page).toHaveURL(/\/universe(\?[^#]*)?#\/instrument\/apra-cps-230$/)
  await expect(page.getByLabel('Selected node details')).toContainText('APRA CPS 230')
})

test('section navigation and browser Back work without reloads', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/universe(\?[^#]*)?$/)
  if (isMobile) await page.getByRole('button', { name: 'Open sections menu' }).click()
  await page.getByRole('navigation', { name: 'Atlas sections' }).getByRole('link', { name: 'Use cases' }).click()
  await expect(page).toHaveURL(/\/cases(\?[^#]*)?$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/universe(\?[^#]*)?$/)
})

test('presenting fills the screen and offers the guided tours', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Presenting is a desktop and projector feature')
  await page.goto('/cases')
  await page.getByRole('button', { name: 'Present the Universe' }).click()
  await expect(page).toHaveURL(/\/universe/)
  await expect(page.locator('html')).toHaveAttribute('data-stage', '')
  await expect(page.getByRole('navigation', { name: 'Atlas sections' })).toBeHidden()
  const dock = page.getByRole('region', { name: 'Presenting' })
  await expect(dock).toBeVisible()
  await dock.getByRole('button').nth(1).click()
  await expect(page.getByRole('region', { name: /Guided tour/ })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: /Stop presenting/ }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-stage', '')
})

for (const path of ['/universe', '/questions', '/cases']) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path)
    await page.waitForTimeout(1200)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    expect(serious.map((violation) => `${violation.id}: ${violation.nodes.slice(0, 3).map((node) => node.target.join(' ')).join(', ')}`)).toEqual([])
  })
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
