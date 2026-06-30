import { asGuest } from './utils/auth';
import { expect, test } from './utils/base';

test.describe('Next Game page', () => {
    test('forwards to the next game for guest users', async ({ page }) => {
        await asGuest(page, '/footy/nextgame');

        await expect(page).toHaveURL(/.*game/);
    });
});
