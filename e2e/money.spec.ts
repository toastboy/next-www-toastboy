import { test, expect } from '@playwright/test';

test('money', async ({ page }) => {

    await page.goto('/footy/money');

    expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);

    await page.getByLabel('Username:').fill('testadmin');
    await page.getByLabel('Password:').fill('correcthorse');

    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/footy\/money/);

    expect(await page.getByText('Bad login: try again').count()).toEqual(0);

    // TODO More tests go here

    const logout = page.getByText('Log Out');
    expect(await logout.count()).toEqual(1);
    await logout.click();

});
