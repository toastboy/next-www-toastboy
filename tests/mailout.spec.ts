import { test, expect } from '@playwright/test';

test('mail active players', async ({ page }) => {

    await page.goto('/footy/mailout');

    expect(await page.getByText('You must be logged in to use this page. If you would like to request an account, please complete this form:').count()).toEqual(1);

    await page.getByLabel('Username:').fill('testadmin');
    await page.getByLabel('Password:').fill('correcthorse');

    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/footy\/mailout/);

    expect(await page.getByText('Bad login: try again').count()).toEqual(0);

    await page.getByLabel('Subject').fill('Test missive');
    await page.getByLabel('Body').fill('This is a test of the emergency broadcast system.');
    await page.getByRole('button', { name: 'Send Mail' }).click();

    const logout = page.getByText('Log Out')
    expect(await logout.count()).toEqual(1);
    await logout.click();

    // Check mailhog for the email, then delete it

    const response = await page.goto('http://localhost:8025/');
    expect(response?.ok()).toBeTruthy();

    await page.locator('.ng-binding', { hasText: 'Toastboy FC Mailer' }).first().click();
    expect(await page.getByText('This is a test of the emergency broadcast system.').count()).toBeGreaterThanOrEqual(1);

    await page.locator('.glyphicon-trash').click();
});