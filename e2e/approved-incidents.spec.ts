import { test, expect } from '@playwright/test'

for (const [id, title, source] of [
 ['litellm-release-compromise-2026-10', 'LiteLLM release compromise', 'LiteLLM: corrected attack-chain investigation'],
 ['connectwise-artex-cloud-applications-2026', 'ConnectWise / ARTEX', 'Microsoft: ARTEX campaign and ConnectWise compromise'],
 ['railway-ai-api-key-compromise-2026', 'Railway credential breach', 'Railway: preliminary incident report'],
]) {
 test(`${id} opens evidence and questions`, async ({ page, isMobile }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`/universe?incidents=1#/incident/${id}`)
  if (isMobile) await page.getByRole('button', { name: `${title} Read details` }).click()
  const details = page.getByLabel('Selected node details')
  await expect(details).toContainText(title)
  await expect(details).toContainText('Questions to ask')
  await details.getByText('Sources and limits', { exact: true }).click()
  await expect(details.getByRole('link', { name: source })).toHaveAttribute('href', /^https:\/\//)
  expect(errors).toEqual([])
 })
}
