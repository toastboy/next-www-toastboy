import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('@/actions/recordHallHire', () => ({ recordHallHire: vi.fn() }));
vi.mock('@/actions/updateInvoiceGameDays', () => ({ updateInvoiceGameDays: vi.fn() }));

import { recordHallHire } from '@/actions/recordHallHire';
import { updateInvoiceGameDays } from '@/actions/updateInvoiceGameDays';
import InvoicePage from '@/app/footy/admin/invoice/page';
import gameDayService from '@/services/GameDay';
import { FootyChannel } from '@/types/FootyChannel';

interface AnyElement { type: unknown; props: Record<string, unknown> }

const findElement = (node: unknown, displayName: string): AnyElement | null => {
    if (!node || typeof node !== 'object') return null;
    const el = node as AnyElement;
    if (typeof el.type === 'function') {
        const fn = el.type as { displayName?: string; name?: string };
        const name = fn.displayName ?? fn.name;
        if (name === displayName) return el;
    }
    const children = (el.props as { children?: unknown }).children;
    if (Array.isArray(children)) {
        for (const child of children) {
            const found = findElement(child, displayName);
            if (found) return found;
        }
    }
    return findElement(children, displayName);
};

const makeGameDay = (overrides: Partial<{
    id: number;
    date: Date;
    game: boolean;
    mailSent: Date | null;
    hallCost: number | null;
}> = {}) => ({
    id: 1,
    date: new Date('2026-01-07'),
    game: false,
    mailSent: null,
    hallCost: null,
    ...overrides,
});

describe('Admin Invoice page', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        (gameDayService.getForMonth as Mock).mockResolvedValue([]);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('defaults year and month to next month when search params are absent', async () => {
        vi.setSystemTime(new Date('2025-01-15'));

        const result = await InvoicePage({ searchParams: Promise.resolve({}) });

        expect(gameDayService.getForMonth).toHaveBeenCalledWith(2025, 2);
        const form = findElement(result, 'InvoiceForm');
        expect(form?.props.year).toBe(2025);
        expect(form?.props.month).toBe(2);
    });

    it('rolls over to January of the following year when invoked in December', async () => {
        vi.setSystemTime(new Date('2025-12-20'));

        const result = await InvoicePage({ searchParams: Promise.resolve({}) });

        expect(gameDayService.getForMonth).toHaveBeenCalledWith(2026, 1);
        const form = findElement(result, 'InvoiceForm');
        expect(form?.props.year).toBe(2026);
        expect(form?.props.month).toBe(1);
    });

    it('uses year and month from search params when provided', async () => {
        const result = await InvoicePage({
            searchParams: Promise.resolve({ year: '2025', month: '6' }),
        });

        expect(gameDayService.getForMonth).toHaveBeenCalledWith(2025, 6);
        const form = findElement(result, 'InvoiceForm');
        expect(form?.props.year).toBe(2025);
        expect(form?.props.month).toBe(6);
    });

    it('marks a game day as scheduled when the game flag is true', async () => {
        (gameDayService.getForMonth as Mock).mockResolvedValue([
            makeGameDay({ game: true, mailSent: null }),
        ]);

        const result = await InvoicePage({ searchParams: Promise.resolve({ year: '2026', month: '1' }) });

        const gameDays = findElement(result, 'InvoiceForm')?.props.gameDays as { gameScheduled: boolean }[];
        expect(gameDays[0]?.gameScheduled).toBe(true);
    });

    it('marks a game day as scheduled when mailSent is not null, regardless of the game flag', async () => {
        (gameDayService.getForMonth as Mock).mockResolvedValue([
            makeGameDay({ game: false, mailSent: new Date('2026-01-01') }),
        ]);

        const result = await InvoicePage({ searchParams: Promise.resolve({ year: '2026', month: '1' }) });

        const gameDays = findElement(result, 'InvoiceForm')?.props.gameDays as { gameScheduled: boolean }[];
        expect(gameDays[0]?.gameScheduled).toBe(true);
    });

    it('marks a game day as not scheduled when game is false and mailSent is null', async () => {
        (gameDayService.getForMonth as Mock).mockResolvedValue([
            makeGameDay({ game: false, mailSent: null }),
        ]);

        const result = await InvoicePage({ searchParams: Promise.resolve({ year: '2026', month: '1' }) });

        const gameDays = findElement(result, 'InvoiceForm')?.props.gameDays as { gameScheduled: boolean }[];
        expect(gameDays[0]?.gameScheduled).toBe(false);
    });

    it('passes the updateInvoiceGameDays action to InvoiceForm', async () => {
        const result = await InvoicePage({ searchParams: Promise.resolve({ year: '2026', month: '1' }) });

        const form = findElement(result, 'InvoiceForm');
        expect(form?.props.onUpdateGameDays).toBe(updateInvoiceGameDays);
    });

    it('passes the recordHallHire action to InvoiceForm', async () => {
        const result = await InvoicePage({ searchParams: Promise.resolve({ year: '2026', month: '1' }) });

        const form = findElement(result, 'InvoiceForm');
        expect(form?.props.onRecordHallHire).toBe(recordHallHire);
    });

    it('renders AutoRefresh with the Games and Money channels', async () => {
        const result = await InvoicePage({ searchParams: Promise.resolve({ year: '2026', month: '1' }) });

        const autoRefresh = findElement(result, 'AutoRefresh');
        expect(autoRefresh?.props.channels).toEqual([FootyChannel.Games, FootyChannel.Money]);
    });
});
