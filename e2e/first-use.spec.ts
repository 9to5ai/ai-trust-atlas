import { expect, test } from '@playwright/test'

test('first-use chooser and map reading guide orient a new visitor', async ({ page }) => {
  await page.goto('/universe')
  await expect(page.getByRole('heading', { name: 'What are you preparing for?' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Take the recommended tour/ })).toBeVisible()
  const guide = page.getByText('How to read this map')
  await expect(guide).toBeVisible()
  await guide.click()
  await expect(page.getByText(/A line or route does not show that a source applies to you/)).toBeVisible()
})
