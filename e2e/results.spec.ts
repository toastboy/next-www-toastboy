import { test, expect } from '@playwright/test';

test('results page', async ({ page }) => {

    const response = await page.goto('/footy/results');
    await expect(page).toHaveURL(/.*results/);
    expect(response?.ok()).toBeTruthy();

});