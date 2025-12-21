import { expect, test } from '@/tests/playwright/fixtures';

test('results page', async ({ page }) => {
    const response = await page.goto('/footy/results');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    await expect(page).toHaveURL(/.*results/);
    expect(response?.ok()).toBeTruthy();
});
