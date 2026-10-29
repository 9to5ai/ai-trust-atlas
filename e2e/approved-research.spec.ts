import { expect, test } from '@playwright/test'
import { csiroOversightSource, csiroOversightSourceQuestions, csiroOversightReadingQuestions, enisaLayerQuestions } from '../src/data/csiroScalableOversight'

const cases = [
  {kind: 'instrument', id: csiroOversightSource.id, url: csiroOversightSource.officialUrl, prompts: csiroOversightSourceQuestions},
  {kind: 'provision', id: 'csiro-oversight-reading', url: csiroOversightSource.provisions[0].sourceUrl!, prompts: csiroOversightReadingQuestions},
  {kind: 'provision', id: 'enisa-ai-layers', url: 'https://www.enisa.europa.eu/sites/default/files/publications/Multilayer%20Framework%20for%20Good%20Cybersecurity%20Practices%20for%20AI.pdf#page=7', prompts: enisaLayerQuestions},
] as const

for (const item of cases) test(`approved research: ${item.id} supports four roles, citations and a meeting brief`, async ({page, isMobile}) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`/universe#/${item.kind}/${item.id}`)
  if (isMobile) await page.getByRole('button', {name: /Read details/}).click()
  const details = page.getByLabel('Selected node details')
  await expect(details).toBeVisible()
  const panel = details.getByRole('region', {name: 'Questions to ask'})
  for (const [role, label] of [['board', 'Board'], ['executive', 'Executive'], ['regulator', 'Regulator'], ['assurance', 'Internal audit & assurance']] as const) {
    await panel.getByRole('button', {name: label, exact: true}).click()
    const card = panel.locator('.leadership-question').first()
    await expect(card).toContainText(item.prompts[role])
    const disclosure = card.locator('details')
    if (!await disclosure.evaluate(element => (element as HTMLDetailsElement).open)) await card.locator('summary').click()
    await expect(card.getByRole('link').first()).toHaveAttribute('href', item.url)
    await expect(card.getByRole('link').first()).toBeVisible()
    await card.getByRole('button', {name: '+ Add to brief', exact: true}).click()
  }
  await panel.getByRole('button', {name: 'Brief · 4', exact: true}).click()
  const brief = page.getByRole('dialog', {name: 'Your meeting brief'})
  await expect(brief).toBeVisible()
  for (const prompt of Object.values(item.prompts)) await expect(brief.getByRole('heading', {name: prompt, exact: true})).toBeVisible()
  await expect(brief.getByRole('link').first()).toHaveAttribute('href', item.url)
  expect(errors).toEqual([])
})
