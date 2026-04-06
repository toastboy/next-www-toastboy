import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    getBankHolidays,
    getBankHolidaysCacheState,
    isWorkingDay,
    primeBankHolidaysCacheForTesting,
    resetBankHolidaysCache,
} from '@/lib/dates';

/**
 * Helper to create a mock bank holidays API response for England and Wales.
 *
 * @param dates - A list of bank holiday dates in `YYYY-MM-DD` format to include in the mock response.
 * @returns A mock API response object containing the `england-and-wales` division and one event per supplied date.
 */
const createBankHolidaysResponse = (dates: string[]) => ({
    'england-and-wales': {
        division: 'england-and-wales',
        events: dates.map((date) => ({
            title: 'Bank Holiday',
            date,
            notes: '',
            bunting: true,
        })),
    },
});

describe('isWorkingDay', () => {
    /** A bank holidays set containing a known weekday (Wednesday 1 Jan 2025). */
    const bankHolidays = new Set(['2025-01-01']);

    describe('returns true for working days (Monday–Friday) that are not bank holidays', () => {
        it.each([
            ['Monday', new Date('2025-01-06')],
            ['Tuesday', new Date('2025-01-07')],
            ['Wednesday', new Date('2025-01-08')],
            ['Thursday', new Date('2025-01-09')],
            ['Friday', new Date('2025-01-10')],
        ])('%s', (_label, date) => {
            expect(isWorkingDay(date, bankHolidays)).toBe(true);
        });
    });

    describe('returns false for weekends', () => {
        it('Sunday (day 0)', () => {
            expect(isWorkingDay(new Date('2025-01-05'), bankHolidays)).toBe(false);
        });

        it('Saturday (day 6)', () => {
            expect(isWorkingDay(new Date('2025-01-04'), bankHolidays)).toBe(false);
        });
    });

    describe('returns false for bank holidays that fall on weekdays', () => {
        it('New Year\'s Day 2025 (Wednesday)', () => {
            expect(isWorkingDay(new Date('2025-01-01'), bankHolidays)).toBe(false);
        });
    });

    describe('formatDateKey edge cases (tested indirectly via bank holiday matching)', () => {
        it('zero-pads single-digit months', () => {
            const holidays = new Set(['2025-03-03']);
            expect(isWorkingDay(new Date(2025, 2, 3), holidays)).toBe(false);
        });

        it('zero-pads single-digit days', () => {
            const holidays = new Set(['2025-10-07']);
            expect(isWorkingDay(new Date(2025, 9, 7), holidays)).toBe(false);
        });

        it('handles double-digit months and days without extra padding', () => {
            const holidays = new Set(['2025-12-25']);
            expect(isWorkingDay(new Date(2025, 11, 25), holidays)).toBe(false);
        });

        it('matches correctly at a year boundary (31 Dec)', () => {
            const holidays = new Set(['2025-12-31']);
            expect(isWorkingDay(new Date(2025, 11, 31), holidays)).toBe(false);
        });

        it('matches correctly at a year boundary (1 Jan)', () => {
            const holidays = new Set(['2026-01-01']);
            expect(isWorkingDay(new Date(2026, 0, 1), holidays)).toBe(false);
        });

        it('does not match when bank holiday key is absent', () => {
            const holidays = new Set(['2025-06-02']);
            expect(isWorkingDay(new Date(2025, 5, 3), holidays)).toBe(true);
        });
    });
});

describe('getBankHolidays', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        resetBankHolidaysCache();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(createBankHolidaysResponse([])),
        }));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('fetches bank holidays from the API and populates the cache', async () => {
        const mockDates = ['2025-01-01', '2025-04-18'];
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(createBankHolidaysResponse(mockDates)),
        } as Response);

        const result = await getBankHolidays();

        expect(result).toEqual(new Set(mockDates));
        const state = getBankHolidaysCacheState();
        expect(state.cache).toEqual(new Set(mockDates));
        expect(state.cacheTime).toBeGreaterThan(0);
    });

    it('returns cached data on subsequent calls within the TTL', async () => {
        primeBankHolidaysCacheForTesting(['2025-12-25'], Date.now());

        const result = await getBankHolidays();

        expect(result).toEqual(new Set(['2025-12-25']));
        expect(fetch).not.toHaveBeenCalled();
    });

    it('re-fetches when the cache has expired', async () => {
        const staleTime = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
        primeBankHolidaysCacheForTesting(['2025-12-25'], staleTime);

        const freshDates = ['2025-01-01', '2025-12-25', '2025-12-26'];
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(createBankHolidaysResponse(freshDates)),
        } as Response);

        const result = await getBankHolidays();

        expect(fetch).toHaveBeenCalledOnce();
        expect(result).toEqual(new Set(freshDates));
    });

    it('falls back to cached data when fetch returns a non-ok response', async () => {
        primeBankHolidaysCacheForTesting(['2025-12-25'], 0); // expired cache

        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        } as Response);

        const result = await getBankHolidays();

        expect(result).toEqual(new Set(['2025-12-25']));
    });

    it('falls back to cached data when fetch throws', async () => {
        primeBankHolidaysCacheForTesting(['2025-04-18'], 0);

        vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

        const result = await getBankHolidays();

        expect(result).toEqual(new Set(['2025-04-18']));
    });

    it('returns an empty set when fetch fails and no cache exists', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

        const result = await getBankHolidays();

        expect(result).toEqual(new Set());
    });

    it('resetBankHolidaysCache clears the cache completely', () => {
        primeBankHolidaysCacheForTesting(['2025-01-01'], Date.now());

        resetBankHolidaysCache();

        const state = getBankHolidaysCacheState();
        expect(state.cache).toBeNull();
        expect(state.cacheTime).toBe(0);
    });
});
