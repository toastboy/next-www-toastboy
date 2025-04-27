import { expect, test } from '@playwright/test';

test('password reset with good email', async ({ page }) => {
    let response = await page.goto('/footy/forgottenpassword');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*forgottenpassword/);
    await expect(page).toHaveTitle(/Forgotten Password/);

    await page.locator('input#mailto').fill('toastboy@toastboy.co.uk');
    await page.locator('input#mailto').press('Enter');
    expect(await page.getByText('Email not found: try again').count()).toEqual(0);
    await expect(page).toHaveURL(/.*donepasswordreset/);

    // Check mailhog for the password reset email, then delete it

    response = await page.goto('http://localhost:8025/');
    expect(response?.ok()).toBeTruthy();

    await page.locator('.ng-binding', { hasText: 'Toastboy FC Mailer' }).first().click();
    expect(await page.getByText('This is an automated mail to tell you that your password for Toastboy FC has been reset').count()).toBeGreaterThanOrEqual(1);

    // TODO Could grab the new password and check it works

    await page.locator('.glyphicon-trash').click();

});

test('password reset with bad email', async ({ page }) => {

    const response = await page.goto('/footy/forgottenpassword');
    expect(response?.ok()).toBeTruthy();

    await page.locator('input#mailto').fill('billgates@microsoft.com');
    await page.locator('input#mailto').press('Enter');
    expect(await page.getByText('Email not found: try again').count()).toEqual(1);

});
