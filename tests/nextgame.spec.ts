import { test, expect } from '@playwright/test';

test('next game page', async ({ page }) => {

    const response = await page.goto('/footy/nextgame');
    await expect(page).toHaveURL(/.*game/);
    expect(response?.ok()).toBeTruthy();

});