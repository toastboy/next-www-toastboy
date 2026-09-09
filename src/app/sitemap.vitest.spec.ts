import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: vi.fn(() => 'https://footy.example'),
}));
vi.mock('@/services/Player');
vi.mock('@/services/GameDay');

import sitemap from '@/app/sitemap';
import gameDayService from '@/services/GameDay';
import playerService from '@/services/Player';

const urlsFrom = async () => (await sitemap()).map((entry) => entry.url);

describe('sitemap', () => {
    beforeEach(() => {
        (playerService.getAllIds as Mock).mockResolvedValue([1, 2]);
        (gameDayService.getAll as Mock).mockResolvedValue([
            { id: 10 },
            { id: 11 },
        ]);
        (gameDayService.getAllYears as Mock).mockResolvedValue([2026, 2025]);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('includes the fixed public pages as absolute URLs', async () => {
        const urls = await urlsFrom();

        expect(urls).toContain('https://footy.example/');
        expect(urls).toContain('https://footy.example/footy');
        expect(urls).toContain('https://footy.example/footy/rules');
        expect(urls).toContain('https://footy.example/footy/docs/privacy');
    });

    it('normalises a base URL that carries a trailing slash', async () => {
        const { getPublicBaseUrl } = await import('@/lib/urls');
        (getPublicBaseUrl as Mock).mockReturnValueOnce(
            'https://footy.example/',
        );

        const urls = await urlsFrom();

        expect(urls).toContain('https://footy.example/footy');
        expect(urls.some((url) => url.includes('.example//'))).toBe(false);
    });

    it('adds one entry per player', async () => {
        const urls = await urlsFrom();

        expect(urls).toContain('https://footy.example/footy/player/1');
        expect(urls).toContain('https://footy.example/footy/player/2');
    });

    it('adds one entry per game day', async () => {
        const urls = await urlsFrom();

        expect(urls).toContain('https://footy.example/footy/game/10');
        expect(urls).toContain('https://footy.example/footy/game/11');
    });

    it('adds one entry per league table', async () => {
        const urls = await urlsFrom();

        for (const table of [
            'points',
            'averages',
            'stalwart',
            'speedy',
            'pub',
        ]) {
            expect(urls).toContain(
                `https://footy.example/footy/table/${table}`,
            );
        }
    });

    it('adds results, fixtures and winners entries for every year with games', async () => {
        const urls = await urlsFrom();

        for (const year of [2026, 2025]) {
            expect(urls).toContain(
                `https://footy.example/footy/results/${year}`,
            );
            expect(urls).toContain(
                `https://footy.example/footy/fixtures/${year}`,
            );
            expect(urls).toContain(
                `https://footy.example/footy/winners/${year}`,
            );
        }
    });

    it('produces only absolute, de-duplicated URLs', async () => {
        const urls = await urlsFrom();

        expect(
            urls.every((url) => url.startsWith('https://footy.example')),
        ).toBe(true);
        expect(new Set(urls).size).toBe(urls.length);
    });

    it('de-duplicates when a source returns repeated values', async () => {
        (gameDayService.getAllYears as Mock).mockResolvedValue([
            2026, 2026, 2025,
        ]);
        (gameDayService.getAll as Mock).mockResolvedValue([
            { id: 10 },
            { id: 10 },
        ]);

        const urls = await urlsFrom();

        expect(new Set(urls).size).toBe(urls.length);
        expect(
            urls.filter(
                (url) => url === 'https://footy.example/footy/results/2026',
            ),
        ).toHaveLength(1);
        expect(
            urls.filter((url) => url === 'https://footy.example/footy/game/10'),
        ).toHaveLength(1);
    });

    it('propagates a service failure', async () => {
        (playerService.getAllIds as Mock).mockRejectedValueOnce(
            new Error('db down'),
        );

        await expect(sitemap()).rejects.toThrow('db down');
    });

    it('emits only the static pages when the database is empty', async () => {
        (playerService.getAllIds as Mock).mockResolvedValue([]);
        (gameDayService.getAll as Mock).mockResolvedValue([]);
        (gameDayService.getAllYears as Mock).mockResolvedValue([]);

        const urls = await urlsFrom();

        expect(urls).toContain('https://footy.example/footy');
        expect(urls.some((url) => url.includes('/footy/player/'))).toBe(false);
        expect(urls.some((url) => url.includes('/footy/game/'))).toBe(false);
        expect(urls.some((url) => /\/footy\/results\/\d/.test(url))).toBe(
            false,
        );
    });
});
