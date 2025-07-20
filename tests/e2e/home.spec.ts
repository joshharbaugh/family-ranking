import { test, expect, Page } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }: { page: Page }) => {
    await page.goto('/')

    // Check if the page loads
    await expect(page).toHaveTitle(/FamRank/)

    // Check if the header is visible
    await expect(page.locator('h1')).toContainText('FamRank')

    // Check if navigation is present
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should have working navigation tabs', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/')

    // Check if main navigation tabs are present
    await expect(page.getByRole('tab', { name: /search/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /rankings/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /family/i })).toBeVisible()
  })

  test('should display theme toggle', async ({ page }: { page: Page }) => {
    await page.goto('/')

    // Check if theme toggle button is present
    await expect(
      page.locator('button[aria-label="Toggle theme"]')
    ).toBeVisible()
  })

  test('should handle theme toggle', async ({ page }: { page: Page }) => {
    await page.goto('/')

    const themeToggle = page.locator('button[aria-label="Toggle theme"]')

    // Check initial state (should have sun icon for light mode)
    await expect(themeToggle.locator('svg')).toBeVisible()

    // Click theme toggle
    await themeToggle.click()

    // Wait for theme change to take effect
    await page.waitForTimeout(100)

    // Verify theme toggle is still visible after click
    await expect(themeToggle).toBeVisible()
  })
})
