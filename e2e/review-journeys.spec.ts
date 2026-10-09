import { expect, test } from '@playwright/test'

test.describe('ranked review tasks', () => {
  test('finds an Australian operational-risk requirement and compares related sources', async ({ page }) => {
      await page.goto('/universe#/instrument/apra-cps-230')
      if (test.info().project.name === 'mobile') await page.getByRole('button', { name: /APRA CPS 230.*Read details/ }).click()
      const details = page.getByLabel('Selected node details')
      await expect(details).toContainText('CPS 230 Operational Risk Management')
      await expect(details.getByTestId('source-review-signal')).toContainText('Selected section review date')
      await expect(details).toContainText('What it requires')
      await details.getByRole('button', { name: 'Related items' }).click()
      const compare = page.getByRole('region', { name: 'AI Trust ontology graph' }).getByRole('tabpanel')
      await expect(compare).toBeVisible()
      await expect(compare).toContainText('Operational risk framework')
      await expect(compare).toContainText('recorded requirements')
      await page.getByRole('tab', { name: /Related sources/ }).click()
      await expect(compare).toContainText('APRA CPS 234')
      await expect(compare).toContainText('source / Atlas links')
      await expect(compare).toContainText('published / effective')
    })

  test('recovers from an empty use-case result and prepares a board question', async ({ page }) => {
      await page.goto('/cases')
      await page.getByLabel('Search use cases').fill('no-record-matches-this-search')
      await expect(page.getByRole('heading', { name: 'No use cases match' })).toBeVisible()
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await expect(page.getByRole('status')).toContainText('documented deployments')

      await page.goto('/questions')
      await page.getByRole('group', { name: 'Question audience' }).getByRole('button', { name: 'Board' }).click()
      await page.getByRole('button', { name: '+ Add to brief' }).first().click()
      if (test.info().project.name === 'mobile') await page.getByRole('button', { name: /Your shortlist · 1/ }).click()
      else await page.getByRole('complementary', { name: 'Your shortlist' }).getByRole('button', { name: 'Review / export' }).click()
      await expect(page.getByRole('dialog', { name: 'Your meeting brief' })).toBeVisible()
      await expect(page.getByRole('dialog', { name: 'Your meeting brief' })).toContainText('1 questions')
  })
})

test('reduced-motion preference preserves the source lookup journey', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/universe#/instrument/apra-cps-230')
  await expect(page.getByLabel('Selected node details')).toContainText('CPS 230 Operational Risk Management')
  await expect(page.getByLabel('Selected node details').getByTestId('source-review-signal')).toContainText('Selected section review date')
})

test('keyboard search opens the Australian CPS 230 source', async ({ page }) => {
  await page.goto('/universe')
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: 'Search everything in the Atlas' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('textbox', { name: 'Search all Atlas objects' }).fill('CPS 230')
  await dialog.getByRole('button', { name: /Source.*APRA CPS 230/ }).click()
  await expect(page.getByLabel('Selected node details')).toContainText('CPS 230 Operational Risk Management')
})
