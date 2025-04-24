import { expect, test } from '@playwright/test';

test('info page', async ({ page }) => {

    const response = await page.goto('/footy/info');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*info/);
    await expect(page).toHaveTitle(/Toastboy FC/);

});
