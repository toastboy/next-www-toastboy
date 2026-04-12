import { expect, test } from '@playwright/test';

test('fixtures page', async ({ page }) => {
    const response = await page.goto('/footy/fixtures');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    await expect(page).toHaveURL(/.*games.*/);
    expect(response?.ok()).toBeTruthy();
});
