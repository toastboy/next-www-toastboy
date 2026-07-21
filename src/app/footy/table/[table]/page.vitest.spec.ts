import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/PlayerRecord');
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));
vi.mock('@mantine/core', () => ({
    Group: ({ children }: { children?: unknown }) => children,
    Stack: ({ children }: { children?: unknown }) => children,
}));
vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: vi.fn(() => null),
}));
vi.mock('@/components/TitleWithYearDropdown/TitleWithYearDropdown', () => ({
    TitleWithYearDropdown: vi.fn(() => null),
}));
vi.mock('@/components/YearTable/YearTable', () => ({
    YearTable: vi.fn(() => null),
}));

import { notFound, permanentRedirect } from 'next/navigation';
import { renderToStaticMarkup } from 'react-dom/server';

import TablePage, { generateMetadata } from '@/app/footy/table/[table]/page';
import { YearTable } from '@/components/YearTable/YearTable';
import playerRecordService from '@/services/PlayerRecord';

describe('Table [table] page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (playerRecordService.getAllYears as Mock).mockResolvedValue([0, 2021]);
        (playerRecordService.getTable as Mock).mockResolvedValue([]);
    });

    describe('unpackParams', () => {
        it('calls notFound when the table param is not a valid TableName', async () => {
            await expect(
                TablePage({
                    params: Promise.resolve({ table: 'bogus' }),
                    searchParams: Promise.resolve({}),
                }),
            ).rejects.toThrow('not_found');

            expect(notFound).toHaveBeenCalled();
        });

        it('calls notFound when the year is not in allYears', async () => {
            await expect(
                TablePage({
                    params: Promise.resolve({ table: 'pub' }),
                    searchParams: Promise.resolve({ year: '2099' }),
                }),
            ).rejects.toThrow('not_found');
        });

        it('calls notFound when the year param is not a valid integer', async () => {
            await expect(
                TablePage({
                    params: Promise.resolve({ table: 'pub' }),
                    searchParams: Promise.resolve({ year: 'notanumber' }),
                }),
            ).rejects.toThrow('not_found');
        });

        it('calls permanentRedirect when the URL does not match the canonical URL', async () => {
            // year=0 is "all-time"; canonical URL has no ?year param, so ?year=0 triggers redirect
            await expect(
                TablePage({
                    params: Promise.resolve({ table: 'pub' }),
                    searchParams: Promise.resolve({ year: '0' }),
                }),
            ).rejects.toThrow('permanent_redirect');

            expect(permanentRedirect).toHaveBeenCalledWith('/footy/table/pub');
        });

        it('defaults to year 0 when no year searchParam is provided', async () => {
            await TablePage({
                params: Promise.resolve({ table: 'pub' }),
                searchParams: Promise.resolve({}),
            });

            expect(playerRecordService.getTable).toHaveBeenCalledWith('pub', 0, true);
        });
    });

    describe('Page', () => {
        const call = () => TablePage({
            params: Promise.resolve({ table: 'pub' }),
            searchParams: Promise.resolve({}),
        });

        it('fetches the qualified table data', async () => {
            await call();

            expect(playerRecordService.getTable).toHaveBeenCalledWith('pub', 0, true);
        });

        it('fetches the unqualified table data', async () => {
            await call();

            expect(playerRecordService.getTable).toHaveBeenCalledWith('pub', 0, false);
        });

        it('passes qualified and unqualified data to YearTable', async () => {
            (playerRecordService.getTable as Mock).mockImplementation((
                _table: string, _year: number, qualified: boolean,
            ) => (qualified ? [{ id: 'q' }] : [{ id: 'u' }]));

            renderToStaticMarkup(await call());

            const [[props]] = (YearTable as Mock).mock.calls as [{
                qualified: unknown; unqualified: unknown
            }][];
            expect(props.qualified).toEqual([{ id: 'q' }]);
            expect(props.unqualified).toEqual([{ id: 'u' }]);
        });

        it('propagates errors from a service call', async () => {
            (playerRecordService.getTable as Mock).mockRejectedValue(new Error('DB failed'));

            await expect(call()).rejects.toThrow('DB failed');
        });
    });

    describe('generateMetadata', () => {
        it('builds a title from the qualified table name and year', async () => {
            const metadata = await generateMetadata({
                params: Promise.resolve({ table: 'pub' }),
                searchParams: Promise.resolve({ year: '2021' }),
            });

            expect(metadata.title).toBe('2021 Pub Table');
        });

        it('uses "All-time" in the title when no year is given', async () => {
            const metadata = await generateMetadata({
                params: Promise.resolve({ table: 'pub' }),
                searchParams: Promise.resolve({}),
            });

            expect(metadata.title).toBe('All-time Pub Table');
        });
    });
});
