import { asAdmin, asGuest, asUser, mustBeLoggedInAsAdmin } from './utils/auth';
import { expect, test } from './utils/base';

test.describe('drinkers admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/admin/drinkers');

        await mustBeLoggedInAsAdmin(page);
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/admin/drinkers');

        await mustBeLoggedInAsAdmin(page);
    });

    test('allows access to admin users and shows drinkers admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/admin/drinkers');

        await expect(page).toHaveURL(/\/footy\/admin\/drinkers\/\d+$/);
        await expect(page.getByRole('heading', { name: /Game \d+ Drinkers/i })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save drinkers' })).toBeVisible();
    });
});
