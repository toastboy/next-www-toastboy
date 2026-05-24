import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
}));

vi.mock('@/services/GameDay');
vi.mock('@/services/PlayerRecord');

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: () => null,
}));

vi.mock('@/components/RecordsTable/RecordsTable');

vi.mock('@mantine/core', () => ({
    Anchor: ({ children }: { children?: unknown }) => children,
    Divider: () => null,
    Group: ({ children }: { children?: unknown }) => children,
    Image: ({ alt }: { alt?: string }) => alt ?? '',
    Stack: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

import HomePage from '@/app/footy/page';
import gameDayService from '@/services/GameDay';
import playerRecordService from '@/services/PlayerRecord';

async function renderPage(): Promise<string> {
    return renderToStaticMarkup(await HomePage());
}

describe('Footy home page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls notFound when there is no current year', async () => {
        (gameDayService.getCurrentYear as Mock).mockResolvedValue(null);
        await expect(HomePage()).rejects.toThrow('not_found');
    });

    it('calls getTable for points, averages, and stalwart with the current year and top-3 limit', async () => {
        (gameDayService.getCurrentYear as Mock).mockResolvedValue(2024);
        (playerRecordService.getTable as Mock).mockResolvedValue([]);
        await renderPage();
        expect(playerRecordService.getTable).toHaveBeenCalledTimes(3);
        expect(playerRecordService.getTable).toHaveBeenCalledWith('points',   2024, true, 3);
        expect(playerRecordService.getTable).toHaveBeenCalledWith('averages', 2024, true, 3);
        expect(playerRecordService.getTable).toHaveBeenCalledWith('stalwart', 2024, true, 3);
    });

    it('renders the crest image alt text', async () => {
        (gameDayService.getCurrentYear as Mock).mockResolvedValue(2024);
        (playerRecordService.getTable as Mock).mockResolvedValue([]);
        const html = await renderPage();
        expect(html).toContain('Toastboy FC Crest');
    });

    it('renders a RecordsTable for each of points, averages, and stalwart', async () => {
        (gameDayService.getCurrentYear as Mock).mockResolvedValue(2024);
        (playerRecordService.getTable as Mock).mockResolvedValue([]);
        const html = await renderPage();
        expect(html).toContain('&quot;table&quot;:&quot;points&quot;');
        expect(html).toContain('&quot;table&quot;:&quot;averages&quot;');
        expect(html).toContain('&quot;table&quot;:&quot;stalwart&quot;');
    });
});
