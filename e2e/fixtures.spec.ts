import { expect, test } from './utils/test';

test('fixtures page', async ({ page }) => {
    const response = await page.goto('/footy/fixtures');
    await expect(page).toHaveURL(/.*games.*/);
    expect(response?.ok()).toBeTruthy();
});
