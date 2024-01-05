import { test, expect } from '@playwright/test';

test('turnout page', async ({ page }) => {

    var response = await page.goto('/footy/turnout');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*turnout/);
    await expect(page).toHaveTitle(/Turnout/);

});