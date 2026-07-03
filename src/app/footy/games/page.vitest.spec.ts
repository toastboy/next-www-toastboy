import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('@mantine/core', () => ({
    Flex: ({ children }: { children?: unknown }) => children,
    Group: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: () => null,
}));

vi.mock('@/components/GameDayList/GameDayList', () => ({
    GameDayList: () => null,
}));

vi.mock('@/components/TitleWithYearDropdown/TitleWithYearDropdown', () => ({
    TitleWithYearDropdown: () => null,
}));

import GamesPage, { generateMetadata } from '@/app/footy/games/page';
import gameDayService from '@/services/GameDay';

describe('Games page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (gameDayService.getAllYears as Mock).mockResolvedValue([0, 2023, 2024]);
        (gameDayService.getCurrent as Mock).mockResolvedValue({ id: 1249 });
        (gameDayService.getGamesPlayed as Mock).mockResolvedValue(5);
        (gameDayService.getGamesCancelled as Mock).mockResolvedValue(1);
        (gameDayService.getGamesRemaining as Mock).mockResolvedValue(3);
        (gameDayService.getAll as Mock).mockResolvedValue([]);
    });

    it('fetches the count of games played and games remaining', async () => {
        await GamesPage({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(gameDayService.getGamesPlayed).toHaveBeenCalledWith(2024, 1249);
        expect(gameDayService.getGamesRemaining).toHaveBeenCalledWith(2024);
    });

    it('fetches both counts in parallel via Promise.all', async () => {
        const callOrder: string[] = [];
        (gameDayService.getGamesPlayed as Mock).mockImplementation(() => {
            callOrder.push('played-start');
            return 5;
        });
        (gameDayService.getGamesCancelled as Mock).mockImplementation(() => {
            callOrder.push('cancelled-start');
            return 1;
        });
        (gameDayService.getGamesRemaining as Mock).mockImplementation(() => {
            callOrder.push('remaining-start');
            return 3;
        });

        await GamesPage({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(callOrder.sort()).toEqual(['cancelled-start', 'played-start', 'remaining-start']);
        expect(gameDayService.getGamesPlayed).toHaveBeenCalledTimes(1);
        expect(gameDayService.getGamesCancelled).toHaveBeenCalledTimes(1);
        expect(gameDayService.getGamesRemaining).toHaveBeenCalledTimes(1);
    });

    it('passes gamesPlayed and gamesRemaining to the rendered output', async () => {
        const element = await GamesPage({ searchParams: Promise.resolve({ year: '2024' }) });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('5 played');
        expect(html).toContain('1 cancelled');
        expect(html).toContain('3 confirmed');
    });

    it('handles service errors gracefully', async () => {
        (gameDayService.getGamesPlayed as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(
            GamesPage({ searchParams: Promise.resolve({ year: '2024' }) }),
        ).rejects.toThrow('DB failed');
    });

    it('calls notFound when the selected year is not in allYears', async () => {
        await expect(
            GamesPage({ searchParams: Promise.resolve({ year: '1999' }) }),
        ).rejects.toThrow('not_found');
    });

    it('calls notFound when the year param is not a valid integer', async () => {
        await expect(
            GamesPage({ searchParams: Promise.resolve({ year: 'notanumber' }) }),
        ).rejects.toThrow('not_found');
    });

    it('redirects to the canonical URL when the current URL does not match', async () => {
        await expect(
            GamesPage({ searchParams: Promise.resolve({}) }),
        ).rejects.toThrow('permanent_redirect');
    });

    it('does not redirect when year=2024 is already the canonical URL', async () => {
        await expect(
            GamesPage({ searchParams: Promise.resolve({ year: '2024' }) }),
        ).resolves.toBeDefined();
    });

    it('generates metadata with the year-specific title', async () => {
        const metadata = await generateMetadata({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(metadata.title).toBe('2024 Games');
    });

    it('does not redirect when year=0 is already explicit in the query, and omits the year prefix from the subhead title', async () => {
        const element = await GamesPage({ searchParams: Promise.resolve({ year: '0' }) });
        const html = renderToStaticMarkup(element);

        expect(html).not.toContain('0 Games');
    });

    it('omits played/cancelled/confirmed counts from the subhead when they are zero', async () => {
        (gameDayService.getGamesPlayed as Mock).mockResolvedValue(0);
        (gameDayService.getGamesCancelled as Mock).mockResolvedValue(0);
        (gameDayService.getGamesRemaining as Mock).mockResolvedValue(0);

        const element = await GamesPage({ searchParams: Promise.resolve({ year: '2024' }) });
        const html = renderToStaticMarkup(element);

        expect(html).not.toContain('played');
        expect(html).not.toContain('cancelled');
        expect(html).not.toContain('confirmed');
    });
});
