import { expect, test } from './utils/base';

test('fixtures page', async ({ page }) => {
    const response = await page.goto('/footy/fixtures');
    await expect(page).toHaveURL(/.*games.*/);
    expect(response?.ok()).toBeTruthy();
});
