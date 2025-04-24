import { test, expect } from '@playwright/test';

test('fixtures page', async ({ page }) => {

    const response = await page.goto('/footy/fixtures');
    await expect(page).toHaveURL(/.*fixtures/);
    expect(response?.ok()).toBeTruthy();

});
