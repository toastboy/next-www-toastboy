import { expect, test } from '@playwright/test';

test('results page', async ({ page }) => {
    const response = await page.goto('/footy/results');
    await expect(page).toHaveURL(/.*games.*/);
    expect(response?.ok()).toBeTruthy();
});
