import { expect, test } from '@playwright/test';

import { asGuest } from './utils/auth';

test.describe('Next Game page', () => {
    test('forwards to the next game for guest users', async ({ page }) => {
        await asGuest(page, '/footy/nextgame');

        await expect(page.getByText('Sign in to your account')).not.toBeVisible();
        await expect(page.getByText('You must be logged in as an administrator')).not.toBeVisible();

        await expect(page).toHaveURL(/.*game/);
    });
});
