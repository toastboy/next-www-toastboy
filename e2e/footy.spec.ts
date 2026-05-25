import { expect, test } from '@playwright/test';

test('footy page renders crest, info link, and copyright', async ({ page }) => {
    const response = await page.goto('/footy');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle(/Toastboy FC/);

    const crestImg = page.getByRole('main').getByRole('img', { name: 'Toastboy FC Crest' });
    await expect(crestImg).toBeVisible();

    const infoLink = page.getByRole('link', { name: 'Information about Toastboy FC' });
    await expect(infoLink).toBeVisible();
    await expect(infoLink).toHaveAttribute('href', '/footy/info');

    await expect(page.getByText('Who are we?')).toBeVisible();
    await expect(page.getByText('Crest design ©2003 by Joe Bright')).toBeVisible();

    await expect(page).toHaveScreenshot('footy.png');
});

test('footy info link navigates to /footy/info', async ({ page }) => {
    await page.goto('/footy');
    await page.getByRole('link', { name: 'Information about Toastboy FC' }).click();
    await expect(page).toHaveURL(/\/footy\/info$/);
});
