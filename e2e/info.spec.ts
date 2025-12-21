import { expect, test } from '@/tests/playwright/fixtures';

test('info page', async ({ page }) => {
    const response = await page.goto('/footy/info');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*info/);
    await expect(page).toHaveTitle(/Toastboy FC/);
});
