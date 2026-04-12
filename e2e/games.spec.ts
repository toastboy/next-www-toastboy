import { expect, test } from '@playwright/test';

test('games list page', async ({ page }) => {
    await page.goto('/footy/games');

    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

    await expect(page).toHaveURL(/.*games/);

    await expect(page.getByRole('heading').filter({ hasText: /played/ })).toBeVisible();
});
