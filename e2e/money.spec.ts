import { expect, test } from '@playwright/test';
import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('Money admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/money');

        expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/money');

        expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);
    });

    test('allows access to admin users and shows money admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/money');

        expect(await page.getByText('(Not yet implemented)').count()).toEqual(1);
    });
});
