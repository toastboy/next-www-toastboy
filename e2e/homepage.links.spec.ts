import { expect, test } from '@playwright/test';

test('enumerate homepage links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
    await expect(page).toHaveTitle(/Toastboy FC/);

    const links = page.locator('a:visible');
    const linksCount = await links.count();

    const hrefs: string[] = [];
    const linktexts: string[] = [];
    for (let i = 0; i < linksCount; i++) {
        const link = await links.nth(i).getAttribute('href');
        if (link)
            hrefs.push(link);
        const text = (await links.nth(i).allInnerTexts()).join();
        if (text)
            hrefs.push(text);
    }

    console.log(hrefs);
    console.log(linktexts);
});
