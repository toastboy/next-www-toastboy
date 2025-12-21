import { expect, test } from '@/tests/playwright/fixtures';

import { asGuest, asUser } from './utils/auth';

test.describe('Player Profile page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/profile');

        await expect(page.locator('[data-testid="must-be-logged-in"]')).toBeVisible();
    });

    test('profile access for regular users', async ({ page }) => {
        await asUser(page, '/footy/profile');
        // await page.getByLabel('First Name:').fill('Aloysus');
        // await page.getByLabel('Last Name:').fill('Bringdangle');
        // await page.getByLabel('Born DD').fill('19');
        // await page.getByLabel('Born MM').fill('12');
        // await page.getByLabel('Born YYYY').fill('1967');
        // await page.getByLabel('email(s):').fill('sickymickey@toastboy.co.uk');
        // await page.getByLabel('National team(s) supported:').fill('Burundi');
        // await page.getByLabel('Club team(s) supported:').fill('Borussia Dortmund');
        // await page.getByLabel('Comments:').fill('How lovely');
        // await page.getByRole('button', { name: 'Submit' }).click();

        // await expect(page).toHaveURL('/footy/player/testuser');

        // await page.locator('#playermasthead').screenshot({ path: 'test-results/screenshots/playermasthead.png' });
    });
});
