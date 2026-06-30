import { expect, test } from './utils/base';

test('rules page', async ({ page }) => {
    const response = await page.goto('/footy/rules');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*rules/);
    await expect(page).toHaveTitle(/Rules \| Toastboy FC/);
});
