import { expect, test } from '@playwright/test';

test('tables page', async ({ page }) => {
    const response = await page.goto('/footy/tables');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*tables/);
    await expect(page).toHaveTitle(/Toastboy FC Tables/);

    const linkmap = new Map<string, string>([
        ['Points', '/footy/points'],
        ['Averages', '/footy/averages'],
        ['Stalwart', '/footy/stalwart'],
        ['Captain Speedy', '/footy/speedy'],
    ]);

    const hrefs = new Set();
    for (const [key, value] of linkmap) {
        const link = page.getByRole('link', { name: key }).first();
        const href = await link.getAttribute('href');
        expect(href).toContain(value);
        if (href)
            hrefs.add(href.toString());
    }

    console.log(hrefs);
});
