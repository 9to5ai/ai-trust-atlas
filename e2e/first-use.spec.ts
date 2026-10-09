import { expect, test } from '@playwright/test'

test('Start here stays closed on first load and is easy to find on desktop and mobile', async ({ page }) => {
  await page.goto('/universe')
  await expect(page.getByRole('heading', { name: 'What are you preparing for?' })).toHaveCount(0)
  const startHere = page.getByRole('button', { name: 'Open start here' })
  await expect(startHere).toBeVisible()
  await expect(startHere).toHaveClass(/start-here-action/)
  await startHere.click()
  await expect(page.getByRole('heading', { name: 'What are you preparing for?' })).toBeVisible()
  await expect(page.getByText(/A reference map of/)).toHaveCount(0)
  await page.getByRole('button', { name: 'Close start here' }).click()
  await expect(page.getByRole('heading', { name: 'What are you preparing for?' })).toHaveCount(0)
})
