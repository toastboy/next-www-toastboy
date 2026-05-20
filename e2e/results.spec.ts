import { expect, test } from './utils/test';

test('results page', async ({ page }) => {
    const response = await page.goto('/footy/results');
    await expect(page).toHaveURL(/.*games.*/);
    expect(response?.ok()).toBeTruthy();
});
