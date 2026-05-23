import { asAdmin, asGuest, asUser, mustBeLoggedIn, mustBeLoggedInAsAdmin } from './utils/auth';
import { expect, test } from './utils/test';

test.describe('Auth Mocking System', () => {
    test('should show different content for different auth states', async ({ page }) => {
        // Test as guest (no auth)
        await asGuest(page);
        await page.goto('/footy/admin/users');

        // Should be redirected or show login form
        await mustBeLoggedInAsAdmin(page);

        // Test as regular user
        await asUser(page);
        await page.goto('/footy/admin/users');

        // Regular users should not access admin pages
        await mustBeLoggedInAsAdmin(page);

        // Test as admin
        await asAdmin(page);
        await page.goto('/footy/admin/users');

        // Admin should see the users table
        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
        await expect(page.getByRole('table')).toBeVisible();
    });

    test('should allow switching between auth states', async ({ page }) => {
        // Start as guest
        await asGuest(page);
        await page.goto('/footy/profile');
        await mustBeLoggedIn(page);

        // Switch to user
        await asUser(page);
        await page.reload();
        // Should now have access to profile page
        // (assuming profile is accessible to regular users)

        // Switch to admin
        await asAdmin(page);
        await page.goto('/footy/admin/users');
        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
        await expect(page.getByRole('table')).toBeVisible();

        // Switch back to guest
        await asGuest(page);
        await page.reload();
        await mustBeLoggedInAsAdmin(page);
    });
});
