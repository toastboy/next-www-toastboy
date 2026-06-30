import { expect, test } from './utils/base';

test('games list page', async ({ page }) => {
    await page.goto('/footy/games');


    await expect(page).toHaveURL(/.*games/);

    await expect(page.getByRole('heading').filter({ hasText: /Games/ })).toBeVisible();
});
