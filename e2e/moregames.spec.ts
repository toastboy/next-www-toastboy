import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('More Games admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/moregames');

        await expect(page.getByTestId('must-be-admin')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/moregames');

        await expect(page.getByTestId('must-be-admin')).toBeVisible();
    });

    test('allows access to admin users and shows moregames admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/moregames');

        await expect(page.getByTestId('must-be-admin')).not.toBeVisible();
        await expect(page.getByTestId('moregames-form')).toBeVisible();
        await expect(page.getByTestId('moregames-table')).toBeVisible();
        const rowCount = await page.getByTestId('moregames-row').count();
        expect(rowCount).toBeGreaterThan(0);
        await expect(page.getByTestId('moregames-submit')).toBeVisible();
    });
});
