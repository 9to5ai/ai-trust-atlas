import { expect, test } from '@playwright/test'
import { AU_FRONTIER_ID, AU_FRONTIER_URL, auFrontierSourceQuestions } from '../src/data/auFrontierProtections'

test('Australian frontier-AI proposal preserves status, citations and role questions', async ({ page, isMobile }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`/universe#/instrument/${AU_FRONTIER_ID}`)
  if (isMobile) await page.getByRole('button', {name: /Read details/}).click()
  const details = page.getByLabel('Selected node details')
  await expect(details).toBeVisible()
  await expect(details).toContainText('no operative duties')
  const panel = details.getByRole('region', {name: 'Questions to ask'})
  for (const [role, label] of [['board', 'Board'], ['executive', 'Executive'], ['regulator', 'Regulator'], ['assurance', 'Internal audit & assurance']] as const) {
    await panel.getByRole('button', {name: label, exact: true}).click()
    const card = panel.locator('.leadership-question').first()
    await expect(card).toContainText(auFrontierSourceQuestions[role])
    const disclosure = card.locator('details')
    if (!await disclosure.evaluate(element => (element as HTMLDetailsElement).open)) await card.locator('summary').click()
    await expect(card.getByRole('link').first()).toHaveAttribute('href', AU_FRONTIER_URL)
    await card.getByRole('button', {name: '+ Add to brief', exact: true}).click()
  }
  await panel.getByRole('button', {name: 'Brief · 4', exact: true}).click()
  const brief = page.getByRole('dialog', {name: 'Your meeting brief'})
  await expect(brief).toBeVisible()
  for (const prompt of Object.values(auFrontierSourceQuestions)) await expect(brief.getByRole('heading', {name: prompt, exact: true})).toBeVisible()
  expect(errors).toEqual([])
})
