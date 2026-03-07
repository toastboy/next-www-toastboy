import { TableNameSchema } from 'prisma/zod/schemas';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('services/PlayerRecord');

// React is partially mocked so cache becomes a passthrough, preventing result
// sharing between tests
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('@mantine/core', () => ({
    Grid: () => null,
    GridCol: () => null,
    Stack: () => null,
    Title: () => null,
}));

vi.mock('components/WinnersTable/WinnersTable', () => ({
    WinnersTable: () => null,
}));

vi.mock('components/YearSelector/YearSelector', () => ({
    YearSelector: () => null,
}));

import Page from '@/app/footy/winners/page';
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
});
