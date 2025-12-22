import { expect, test } from '@playwright/test';

test('turnout page', async ({ page }) => {
    const response = await page.goto('/footy/turnout');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*turnout/);
    await expect(page).toHaveTitle(/Turnout/);
});
