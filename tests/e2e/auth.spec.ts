import { test, expect, Page } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login button when not authenticated', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/')

    // Check if login button is visible
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  test('should open login modal when login button is clicked', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/')

    // Click login button
    await page.getByRole('button', { name: /login/i }).click()

    // Check if login modal is visible
    await expect(page.getByRole('dialog')).toBeVisible()

    // Check if email and password fields are present
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()

    // Check if Google sign-in button is present
    await expect(
      page.getByRole('button', { name: /sign in with google/i })
    ).toBeVisible()
  })

  test('should close login modal when close button is clicked', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto('/')

    // Open login modal
    await page.getByRole('button', { name: /login/i }).click()

    // Verify modal is open
    await expect(page.getByRole('dialog')).toBeVisible()

    // Close modal (assuming there's a close button or escape key)
    await page.keyboard.press('Escape')

    // Verify modal is closed
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})
