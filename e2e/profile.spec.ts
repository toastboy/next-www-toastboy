import { test, expect } from '@playwright/test';

test('profile page checks', async ({ page }) => {

    await page.goto('/footy/profile');

    expect(await page.getByText('You must be logged in to use this page.').count()).toEqual(1);

    await page.getByLabel('Username:').fill('testuser');
    await page.getByLabel('Password:').fill('testpassword');

    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/footy/profile');

    expect(await page.getByText('Bad login: try again').count()).toEqual(0);

    await page.getByLabel('First Name:').fill('Aloysus');
    await page.getByLabel('Last Name:').fill('Bringdangle');
    await page.getByLabel('Born DD').fill('19');
    await page.getByLabel('Born MM').fill('12');
    await page.getByLabel('Born YYYY').fill('1967');
    await page.getByLabel('email(s):').fill('sickymickey@toastboy.co.uk');
    await page.getByLabel('National team(s) supported:').fill('Burundi');
    await page.getByLabel('Club team(s) supported:').fill('Borussia Dortmund');
    await page.getByLabel('Comments:').fill('How lovely');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL('/footy/player/testuser');

    await page.locator('#playermasthead').screenshot({ path: 'test-results/screenshots/playermasthead.png' });

    const logout = page.getByText('Log Out');
    expect(await logout.count()).toEqual(1);
    await logout.click();
});
