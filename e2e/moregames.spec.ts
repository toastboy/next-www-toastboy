import { expect, test } from '@/tests/playwright/fixtures';

import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('More Games admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/moregames');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/moregames');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('allows access to admin users and shows moregames admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/moregames');

        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();

        // TODO: Add checks for the moregames admin interface elements
        await expect(page.locator('[data-testid="not-implemented"]')).toBeVisible();
    });
});
