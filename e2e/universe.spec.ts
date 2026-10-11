import { expect, test } from '@playwright/test'

for (const renderer of ['webgl', '2d']) {
  test(`${renderer} source groups reveal individual sources on zoom and preserve keyboard selection`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/universe?view=atlas${renderer === '2d' ? '&renderer=2d' : ''}`)
    const canvas = page.getByLabel(/Interactive orbital map/)
    await expect(canvas).toBeVisible()
    // Increase overview density without changing the published corpus.
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click()
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click()
    const groups = page.getByRole('group', { name: 'Grouped sources' })
    const group = groups.getByRole('button').first()
    await expect(group).toBeVisible()
    await expect(group).toHaveAccessibleName(/Explore \d+ .+ sources/)
    await group.focus()
    await page.keyboard.press('Enter')
    await expect(groups.getByRole('button')).toHaveCount(0)
    await expect(canvas).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('button', { name: /Read details/ })).toBeVisible()
    await page.getByRole('button', { name: 'Reset graph view' }).click()
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click()
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click()
    await expect(groups.getByRole('button').first()).toBeVisible()
  })
}
