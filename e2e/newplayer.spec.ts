import { expect, test } from '@playwright/test';

function randname(length: number) {
    let result = '';
    const lowerchars = 'abcdefghijklmnopqrstuvwxyz';
    const upperchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    result += upperchars.charAt(Math.floor(Math.random() * 26));
    for (let i = 1; i < length; i++) {
        result += lowerchars.charAt(Math.floor(Math.random() * 26));
    }
    return result;
}

test('new player', async ({ page }) => {
    await page.goto('/footy/newplayer');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

    expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);

    await page.getByLabel('Username:').fill('testadmin');
    await page.getByLabel('Password:').fill('correcthorse');

    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/footy\/newplayer/);

    expect(await page.getByText('Bad login: try again').count()).toEqual(0);

    const name = randname(6);
    const surname = randname(8);
    const login = (name + surname.charAt(0)).toLowerCase();
    await page.getByLabel('Login:').fill(login);
    await page.getByLabel('Name:').first().fill(name);
    await page.getByLabel('Surname:').fill(surname);
    await page.getByLabel('email(s):').fill(`${login}@example.com`);
    await page.getByRole('combobox').selectOption('12');
    await page.getByRole('button', { name: 'Submit' }).click();

    const logout = page.getByText('Log Out');
    expect(await logout.count()).toEqual(1);
    await logout.click();

    // Check mailhog for the emails, then delete them

    const response = await page.goto('http://localhost:8025/');
    expect(response?.ok()).toBeTruthy();

    await page.locator('.ng-binding', { hasText: 'Toastboy FC Mailer' }).first().click();
    expect(await page.getByText('Please use it to log in as documented in the previous welcome email.').count()).toBeGreaterThanOrEqual(1);

    await page.locator('.glyphicon-arrow-left').click();
    await page.locator('.glyphicon-remove-circle').click();
    await page.locator('.btn-danger').first().click();

});
