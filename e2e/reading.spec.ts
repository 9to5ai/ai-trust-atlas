import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('search lists each source once and opens a full reading view', async ({ page }) => {
  await page.goto('/universe?view=list&q=MAS')
  const results = page.getByLabel('Source search results')
  await expect(results.getByRole('article')).toHaveCount(4)
  await results.getByRole('button', { name: 'MAS AI Risk Guidelines', exact: true }).click()
  const reader = page.getByLabel('Selected node details')
  await expect(reader).toHaveClass(/reading-view/)
  await expect(reader.getByRole('heading', { name: 'MAS AI Risk Guidelines', exact: true })).toBeVisible()
  await expect(reader).toContainText('7 October 2027')
  await expect(reader.getByTestId('source-review-signal')).toBeVisible()
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()
  expect(audit.violations.filter(v => v.impact === 'serious' || v.impact === 'critical').map(v => v.id)).toEqual([])
  await reader.getByRole('button', { name: 'Close details' }).click()
  await expect(results).toBeVisible()
  await expect(results.getByRole('article')).toHaveCount(4)
})

test('use-case reading preserves the directory, filters and browser history', async ({ page }) => {
  await page.goto('/cases')
  await page.getByRole('button',{name:'Detect fraud & manage risk',exact:true}).click()
  await page.getByRole('button',{name:'Proposing new fraud rules',exact:true}).click()
  await expect(page).toHaveURL(/\/cases[^#]*#\/use-case\/cba-fraud-agent/)
  const reader=page.getByLabel('Selected node details')
  await expect(reader.getByRole('heading',{name:'How the work changes'})).toBeVisible()
  await page.goBack()
  await expect(reader).toHaveCount(0)
  await expect(page.getByRole('button',{name:'Detect fraud & manage risk',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Proposing new fraud rules',exact:true}).click()
  await reader.getByRole('button',{name:'Explore connections'}).click()
  await expect(page).toHaveURL(/\/universe\?view=atlas/)
})

test('question context stays in Questions and retains the chosen topic', async ({ page }) => {
  await page.goto('/questions')
  await page.getByRole('button',{name:'Accountability and governance',exact:true}).click()
  await page.getByRole('button',{name:'Read context →',exact:true}).first().click()
  await expect(page).toHaveURL(/\/questions[^#]*#\/concept\//)
  const reader=page.getByLabel('Selected node details')
  await expect(reader).toHaveClass(/reading-view/)
  await reader.getByRole('button',{name:'Close details'}).click()
  await expect(page.getByRole('button',{name:'Accountability and governance',exact:true})).toHaveAttribute('aria-pressed','true')
})


test('opening an unfiltered directory source keeps the entire reader in the viewport', async ({ page }) => {
  await page.goto('/universe')
  await page.getByRole('button', { name: 'AI Adoption Guidance', exact: true }).click()
  const reader = page.getByLabel('Selected node details')
  await expect(reader.getByRole('heading', { name: 'AI Adoption Guidance', exact: true })).toBeInViewport()
  await expect(reader.getByRole('button', { name: 'Close details' })).toBeInViewport()
  await expect.poll(() => reader.evaluate(el => {
    const rect = el.getBoundingClientRect()
    const workspace = el.parentElement!
    return { top: Math.round(rect.top - workspace.getBoundingClientRect().top), bottom: Math.round(rect.bottom - window.innerHeight), scrollTop: workspace.scrollTop, scrollLeft: workspace.scrollLeft }
  })).toEqual({ top: 0, bottom: 0, scrollTop: 0, scrollLeft: 0 })
  await reader.getByRole('button', { name: 'Close details' }).click()
  await expect(page.getByRole('region', { name: 'Universe list' })).toBeVisible()
})
