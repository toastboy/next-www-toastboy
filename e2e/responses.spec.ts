import { expect, test } from '@/tests/playwright/fixtures';

import { asGuest, asUser } from './utils/auth';

test.describe('New game flow', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    // TODO: Uncomment and implement the new game flow tests when the feature is ready

    // // Send invitations for a new game

    // await page.goto('/footy/newgame');
    // await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

    // expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);

    // await page.getByLabel('Username:').fill('testadmin');
    // await page.getByLabel('Password:').fill('correcthorse');

    // await page.getByRole('button', { name: 'Log in' }).click();

    // await page.getByRole('checkbox').check();
    // await page.getByRole('button', { name: 'Submit' }).click();

    // // Check mailhog for the invitation emails, then delete them

    // let response = await page.goto('http://localhost:8025/');
    // expect(response?.ok()).toBeTruthy();

    // await page.locator('.ng-binding', { hasText: 'Toastboy FC Mailer' }).first().click();
    // expect(await page.getByText('Please follow the link to say whether you can play:').count()).toBeGreaterThanOrEqual(1);

    // await page.locator('.glyphicon-arrow-left').click();
    // await page.locator('.glyphicon-remove-circle').click();
    // await page.locator('.btn-danger').first().click();

    // // Set reponse to "Yes" for 10 random players

    // await page.goto('/footy/responses');
    // await expect(page).toHaveURL(/\/footy\/responses/);

    // expect(await page.getByText('Bad login: try again').count()).toEqual(0);

    // const combocount = await page.getByRole('combobox').count();

    // while (await page.locator('h2', { hasText: 'Yes (10)' }).count() != 1) {
    //     const index = Math.ceil(Math.random() * combocount);
    //     const combo = page.getByRole('combobox').nth(index);
    //     await combo.selectOption('Yes');
    //     const update = combo.locator('..');
    //     await update.getByRole('button').click();
    // }

    // // Now pick the sides

    // await page.goto('/footy/picker');

    // await page.getByRole('button', { name: 'Choose Teams' }).click();

    // const logout = page.getByText('Log Out');
    // expect(await logout.count()).toEqual(1);
    // await logout.click();

    // // Check mailhog one last time

    // response = await page.goto('http://localhost:8025/');
    // expect(response?.ok()).toBeTruthy();

    // await page.locator('.ng-binding', { hasText: 'Toastboy FC Mailer' }).first().click();
    // expect(await page.getByText('Footy: teams picked').count()).toBeGreaterThanOrEqual(1);

    // await page.locator('.glyphicon-trash').click();
});
