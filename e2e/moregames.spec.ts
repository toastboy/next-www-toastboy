import { asAdmin, asGuest, asUser } from './utils/auth';
import { expect, test } from './utils/base';

test.describe('More Games admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/moregames');

        await expect(page.getByRole('heading', { name: /must be logged in as an administrator/i })).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/moregames');

        await expect(page.getByRole('heading', { name: /must be logged in as an administrator/i })).toBeVisible();
    });

    test('allows access to admin users and shows moregames admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/moregames');

        await expect(page.getByRole('heading', { name: /must be logged in as an administrator/i })).not.toBeVisible();
        await expect(page.getByRole('table')).toBeVisible();
        const rowCount = await page.getByRole('table').locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
        await expect(page.getByRole('button', { name: 'Create game days' })).toBeVisible();
    });
});
