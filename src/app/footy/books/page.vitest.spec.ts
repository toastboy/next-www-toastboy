import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Money');

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('@mantine/core', () => ({
    Group: () => null,
    Stack: () => null,
}));

vi.mock('@/components/MoneyChart/MoneyChart', () => ({
    MoneyChart: function MoneyChart() { return null; },
}));

vi.mock('@/components/TitleWithYearDropdown/TitleWithYearDropdown', () => ({
    TitleWithYearDropdown: function TitleWithYearDropdown() { return null; },
}));

import BooksPage from '@/app/footy/books/page';
import gameDayService from '@/services/GameDay';
import moneyService from '@/services/Money';
import { defaultMoneyChartData } from '@/tests/mocks/data/money';

interface AnyElement { type: unknown; props: Record<string, unknown> }

const findElement = (node: unknown, name: string): AnyElement | null => {
    if (!node || typeof node !== 'object') return null;
    const el = node as AnyElement;
    if (typeof el.type === 'function') {
        const fn = el.type as { displayName?: string; name?: string };
        const elName = fn.displayName ?? fn.name;
        if (elName === name) return el;
    }
    const children = (el.props as { children?: unknown }).children;
    if (Array.isArray(children)) {
        for (const child of children) {
            const found = findElement(child, name);
            if (found) return found;
        }
    }
    return findElement(children, name);
};

describe('Books page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (gameDayService.getAllYears as Mock).mockResolvedValue([0, 2023, 2024]);
        (moneyService.getChartData as Mock).mockResolvedValue(defaultMoneyChartData);
    });

    it('calls gameDayService.getAllYears with includeAllTime and mostRecentFirst', async () => {
        await BooksPage({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(gameDayService.getAllYears).toHaveBeenCalledOnce();
        expect(gameDayService.getAllYears).toHaveBeenCalledWith({
            includeAllTime: true,
            mostRecentFirst: true,
        });
    });

    it('calls moneyService.getChartData with the resolved year', async () => {
        await BooksPage({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(moneyService.getChartData).toHaveBeenCalledOnce();
        expect(moneyService.getChartData).toHaveBeenCalledWith(2024);
    });

    it('passes chart data to MoneyChart', async () => {
        const result = await BooksPage({ searchParams: Promise.resolve({ year: '2024' }) });

        const chart = findElement(result, 'MoneyChart');
        expect(chart?.props.data).toEqual(defaultMoneyChartData);
    });

    it('passes linkBase to MoneyChart when year is 0 (all-time)', async () => {
        const result = await BooksPage({ searchParams: Promise.resolve({}) });

        const chart = findElement(result, 'MoneyChart');
        expect(chart?.props.linkBase).toBe('/footy/books?year=');
    });

    it('does not pass linkBase to MoneyChart when year is non-zero', async () => {
        const result = await BooksPage({ searchParams: Promise.resolve({ year: '2024' }) });

        const chart = findElement(result, 'MoneyChart');
        expect(chart?.props.linkBase).toBeUndefined();
    });

    it('calls notFound when the year is not in allYears', async () => {
        await expect(
            BooksPage({ searchParams: Promise.resolve({ year: '1999' }) }),
        ).rejects.toThrow('not_found');
    });

    it('calls notFound when the year param is not a valid integer', async () => {
        await expect(
            BooksPage({ searchParams: Promise.resolve({ year: 'notanumber' }) }),
        ).rejects.toThrow('not_found');
    });

    it('calls permanentRedirect when year=0 is explicitly in the search params', async () => {
        // year=0 is "all-time"; canonical URL has no ?year param, so ?year=0 triggers redirect
        await expect(
            BooksPage({ searchParams: Promise.resolve({ year: '0' }) }),
        ).rejects.toThrow('permanent_redirect');
    });

    it('propagates errors from gameDayService.getAllYears', async () => {
        (gameDayService.getAllYears as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(
            BooksPage({ searchParams: Promise.resolve({ year: '2024' }) }),
        ).rejects.toThrow('DB failed');
    });

    it('propagates errors from moneyService.getChartData', async () => {
        (moneyService.getChartData as Mock).mockRejectedValue(new Error('Chart data failed'));

        await expect(
            BooksPage({ searchParams: Promise.resolve({ year: '2024' }) }),
        ).rejects.toThrow('Chart data failed');
    });
});
