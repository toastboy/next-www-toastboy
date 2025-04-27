import { expect, test } from '@playwright/test';

test('password change test', async ({ page }) => {
    const response = await page.goto('/footy/password');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*password/);
    await expect(page).toHaveTitle(/Login required/);

    expect(await page.getByText('You must be logged in to use this page.').count()).toEqual(1);

    await page.getByLabel('Username:').fill('testuser');
    await page.getByLabel('Password:').fill('testpassword');

    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/footy/password');

    await page.locator('#oldpass2').fill('testpassword');
    await page.locator('#newpass12').fill('theflumps');
    await page.locator('#newpass22').fill('theflumps');
    await page.locator('#submit').click();

    expect(await page.getByText('Password changed successfully.').count()).toEqual(1);

    let logout = page.getByText('Log Out');
    expect(await logout.count()).toEqual(1);
    await logout.click();

    await page.getByLabel('Username:').fill('testuser');
    await page.getByLabel('Password:').fill('theflumps');

    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/footy/password');

    await page.locator('#oldpass2').fill('theflumps');
    await page.locator('#newpass12').fill('testpassword');
    await page.locator('#newpass22').fill('testpassword');
    await page.locator('#submit').click();

    expect(await page.getByText('Password changed successfully.').count()).toEqual(1);

    logout = page.getByText('Log Out');
    expect(await logout.count()).toEqual(1);
    await logout.click();

});
