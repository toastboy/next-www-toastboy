import { expect, test } from '@playwright/test';

test('homepage has title and correct links', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Toastboy FC/);

  const linkmap = new Map<string, string>([
    ['Next Game', '/footy/nextgame'],
    ['Results', '/footy/results'],
    ['Fixtures', '/footy/fixtures'],
    ['Points', '/footy/points'],
    ['Averages', '/footy/averages'],
    ['Stalwart Standings', '/footy/stalwart'],
    ['Captain Speedy', '/footy/speedy'],
    ['Pub', '/footy/pub'],
    ['Winners', '/footy/winners'],
    ['Turnout', '/footy/turnout'],
    ['Rules', '/footy/rules'],
    ['Info', '/footy/info'],
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
