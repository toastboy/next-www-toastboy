import { expect, test } from '@playwright/test';

test('root page redirects to /footy', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/footy$/);
});
