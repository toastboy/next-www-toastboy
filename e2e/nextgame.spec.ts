import { expect, test } from '@/tests/playwright/fixtures';

import { asGuest } from './utils/auth';

test.describe('Next Game page', () => {
    test('forwards to the next game for guest users', async ({ page }) => {
        await asGuest(page, '/footy/nextgame');

        await expect(page.locator('[data-testid="must-be-logged-in"]')).not.toBeVisible();
        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();

        await expect(page).toHaveURL(/.*game/);
    });
});
