import { expect, test } from './utils/test';

test('turnout page', async ({ page }) => {
    const response = await page.goto('/footy/turnout');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*turnout/);
    await expect(page).toHaveTitle(/Turnout/);
});
