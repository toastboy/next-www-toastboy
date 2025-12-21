import { expect, test } from '@/tests/playwright/fixtures';

test('games list page', async ({ page }) => {
    await page.goto('/footy/games');

    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

    await expect(page).toHaveURL(/.*games/);

    expect(await page.getByText('games played to date').count()).toEqual(1);
});
