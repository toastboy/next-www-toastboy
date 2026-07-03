import { TableNameSchema } from 'prisma/zod/schemas';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('services/PlayerRecord');

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

// React is partially mocked so cache becomes a passthrough, preventing result
// sharing between tests
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('@mantine/core', () => ({
    Grid: () => null,
    GridCol: () => null,
    Group: () => null,
    Stack: () => null,
    Title: () => null,
}));

vi.mock('components/WinnersTable/WinnersTable', () => ({
    WinnersTable: () => null,
}));

vi.mock('components/TitleWithYearDropdown/TitleWithYearDropdown', () => ({
    TitleWithYearDropdown: () => null,
}));


import { permanentRedirect } from 'next/navigation';

import Page, { generateMetadata } from '@/app/footy/winners/page';
import playerRecordService from '@/services/PlayerRecord';
import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

describe('Winners Page — parallel fetching', () => {
    beforeEach(() => {
        (playerRecordService.getAllYears as Mock).mockResolvedValue([0, 2021]);
        (playerRecordService.getWinners as Mock).mockResolvedValue(defaultPlayerRecordDataList);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('calls getWinners for every table in TableNameSchema', async () => {
        await Page({ searchParams: Promise.resolve({ year: '2021' }) });

        expect(playerRecordService.getWinners).toHaveBeenCalledTimes(TableNameSchema.options.length);
        for (const table of TableNameSchema.options) {
            expect(playerRecordService.getWinners).toHaveBeenCalledWith(table, 2021);
        }
    });

    it('calls getWinners for each table with the resolved year', async () => {
        (playerRecordService.getAllYears as Mock).mockResolvedValue([0, 2019, 2021]);

        await Page({ searchParams: Promise.resolve({ year: '2019' }) });

        expect(playerRecordService.getWinners).toHaveBeenCalledTimes(TableNameSchema.options.length);
        for (const table of TableNameSchema.options) {
            expect(playerRecordService.getWinners).toHaveBeenCalledWith(table, 2019);
        }
    });

    it('populates results for all tables before rendering', async () => {
        const fetchedTables: string[] = [];
        (playerRecordService.getWinners as Mock).mockImplementation(async (table: string) => {
            fetchedTables.push(table);
            return Promise.resolve(defaultPlayerRecordDataList);
        });

        await Page({ searchParams: Promise.resolve({ year: '2021' }) });

        expect(fetchedTables).toHaveLength(TableNameSchema.options.length);
        expect(fetchedTables.sort()).toEqual([...TableNameSchema.options].sort());
    });

    it('propagates an error when one service call rejects', async () => {
        (playerRecordService.getWinners as Mock).mockRejectedValueOnce(new Error('Service failure'));

        await expect(
            Page({ searchParams: Promise.resolve({ year: '2021' }) }),
        ).rejects.toThrow('Service failure');
    });

    it('propagates an error when all service calls reject', async () => {
        (playerRecordService.getWinners as Mock).mockRejectedValue(new Error('All services down'));

        await expect(
            Page({ searchParams: Promise.resolve({ year: '2021' }) }),
        ).rejects.toThrow('All services down');
    });

    it('generates metadata with the year-specific title', async () => {
        const metadata = await generateMetadata({ searchParams: Promise.resolve({ year: '2021' }) });

        expect(metadata.title).toBe('2021 Winners');
    });

    it('calls notFound when the selected year is not in allYears', async () => {
        await expect(
            Page({ searchParams: Promise.resolve({ year: '1999' }) }),
        ).rejects.toThrow('not_found');
    });

    it('calls notFound when the year param is not a valid integer', async () => {
        await expect(
            Page({ searchParams: Promise.resolve({ year: 'notanumber' }) }),
        ).rejects.toThrow('not_found');
    });

    it('permanently redirects to the canonical URL when year=0 is explicit in the query', async () => {
        await expect(
            Page({ searchParams: Promise.resolve({ year: '0' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/winners');
    });

    it('does not redirect when no year param is provided (defaults to all-time)', async () => {
        await expect(
            Page({ searchParams: Promise.resolve({}) }),
        ).resolves.toBeDefined();

        expect(permanentRedirect).not.toHaveBeenCalled();
    });
});
