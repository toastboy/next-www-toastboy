import { expect, Page, test } from '@playwright/test';

async function checkTable(page: Page) {
    const table = await page.$$eval('.bodytable tbody tr', (table) => {
        return table.map(row => {
            const player = row.querySelector('td:nth-child(1) a');
            const score = row.querySelector('td:nth-child(2)');
            return {
                player: (player as HTMLAnchorElement)?.href?.trim(),
                score: score?.textContent?.trim(),
            };
        });
    });

    for (const [player, score] of table.entries()) {
        if (player && score) {
            console.log(player, score);
        }
    }
}

test('points table', async ({ page }) => {

    const response = await page.goto('/footy/points');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*points/);
    await expect(page).toHaveTitle(/All-time Points Table/);

    await checkTable(page);

});

test('averages table', async ({ page }) => {

    const response = await page.goto('/footy/averages');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*averages/);
    await expect(page).toHaveTitle(/All-time Averages Table/);

    await checkTable(page);

});

test('stalwart table', async ({ page }) => {

    const response = await page.goto('/footy/stalwart');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*stalwart/);
    await expect(page).toHaveTitle(/All-time Stalwart Standings/);

    await checkTable(page);

});

test('speedy table', async ({ page }) => {

    const response = await page.goto('/footy/speedy');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*speedy/);
    await expect(page).toHaveTitle(/All-time Captain Speedy/);

    await checkTable(page);

});

test('pub table', async ({ page }) => {

    const response = await page.goto('/footy/pub');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*pub/);
    await expect(page).toHaveTitle(/All-time Drinkers/);

    await checkTable(page);

});

test('winners table', async ({ page }) => {

    const response = await page.goto('/footy/winners');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*winners/);
    await expect(page).toHaveTitle(/All-time Winners/);

});
