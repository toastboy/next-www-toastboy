import { expect, test } from '@playwright/test';

test('rules page', async ({ page }) => {
    const response = await page.goto('/footy/rules');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*rules/);
    await expect(page).toHaveTitle(/Toastboy FC Rules/);
});
