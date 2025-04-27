import { expect, test } from '@playwright/test';

test('next game page', async ({ page }) => {
    const response = await page.goto('/footy/nextgame');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    await expect(page).toHaveURL(/.*game/);
    expect(response?.ok()).toBeTruthy();
});
