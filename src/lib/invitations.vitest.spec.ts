import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetBankHolidaysCache } from '@/lib/bankHolidays';
import { getInvitationDecision } from '@/lib/invitations';
import gameDayService from '@/services/GameDay';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';

vi.mock('@/services/GameDay', () => ({
    default: {
        getUpcoming: vi.fn(),
    },
}));

const mockGameDayService = vi.mocked(gameDayService);

/** Helper to create a mock bank holidays API response for England and Wales. */
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

describe('invitations', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers();
        resetBankHolidaysCache();
        // Default: bank holidays API returns empty list
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(createBankHolidaysResponse([])),
        }));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    describe('getInvitationDecision', () => {
        it('returns no-upcoming-game when no game exists', async () => {
            mockGameDayService.getUpcoming.mockResolvedValue(null);

            const result = await getInvitationDecision();

            expect(result).toEqual({
                status: 'skipped',
                reason: 'no-upcoming-game',
            });
        });

        it('returns already-sent when mail has been sent', async () => {
            const gameDay = createMockGameDay({
                id: 42,
                date: new Date('2026-02-07'),
                mailSent: new Date('2026-02-06'),
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);

            const result = await getInvitationDecision();

            expect(result).toEqual({
                status: 'skipped',
                reason: 'already-sent',
                gameDayId: 42,
                gameDate: gameDay.date,
            });
        });

        it('returns ready when override is true even if mail was sent', async () => {
            const gameDay = createMockGameDay({
                id: 42,
                date: new Date('2026-02-07'),
                mailSent: new Date('2026-02-06'),
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-02-06T10:00:00'));

            const result = await getInvitationDecision(true);

            expect(result.status).toBe('ready');
            expect(result.reason).toBe('ready');
        });

        it('returns too-early when before mail date', async () => {
            // Game on Saturday 2026-02-07, mail date would be Friday 2026-02-06 09:00
            const gameDay = createMockGameDay({
                id: 42,
                date: new Date('2026-02-07'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-02-05T10:00:00'));

            const result = await getInvitationDecision();

            expect(result).toEqual({
                status: 'skipped',
                reason: 'too-early',
                gameDayId: 42,
                gameDate: gameDay.date,
                mailDate: new Date('2026-02-06T09:00:00'),
            });
        });

        it('returns ready when at or past mail date', async () => {
            // Game on Saturday 2026-02-07, mail date would be Friday 2026-02-06 09:00
            const gameDay = createMockGameDay({
                id: 42,
                date: new Date('2026-02-07'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-02-06T09:00:00'));

            const result = await getInvitationDecision();

            expect(result).toEqual({
                status: 'ready',
                reason: 'ready',
                gameDayId: 42,
                gameDate: gameDay.date,
                mailDate: new Date('2026-02-06T09:00:00'),
            });
        });
    });

    describe('mail date skips weekends', () => {
        it('skips back over a weekend to Friday', async () => {
            // Game on Monday 2026-02-09, previous day is Sunday 2026-02-08
            // Should skip to Friday 2026-02-06
            const gameDay = createMockGameDay({
                id: 1,
                date: new Date('2026-02-09'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-02-06T09:00:00'));

            const result = await getInvitationDecision();

            expect(result.mailDate).toEqual(new Date('2026-02-06T09:00:00'));
        });
    });

    describe('mail date skips bank holidays', () => {
        it('skips a bank holiday that falls on a weekday', async () => {
            // Game on Saturday 2026-04-04
            // Previous day is Good Friday 2026-04-03 (bank holiday)
            // Should skip to Thursday 2026-04-02
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(
                    createBankHolidaysResponse(['2026-04-03']),
                ),
            } as Response);

            const gameDay = createMockGameDay({
                id: 1,
                date: new Date('2026-04-04'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-04-02T09:00:00'));

            const result = await getInvitationDecision();

            expect(result.mailDate).toEqual(new Date('2026-04-02T09:00:00'));
        });

        it('skips consecutive bank holidays and weekends (Easter)', async () => {
            // Game on Tuesday 2026-04-07
            // Previous day is Easter Monday 2026-04-06 (bank holiday)
            // Before that: Sunday 2026-04-05 (weekend)
            // Before that: Saturday 2026-04-04 (weekend)
            // Before that: Good Friday 2026-04-03 (bank holiday)
            // Should skip to Thursday 2026-04-02
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(
                    createBankHolidaysResponse(['2026-04-03', '2026-04-06']),
                ),
            } as Response);

            const gameDay = createMockGameDay({
                id: 1,
                date: new Date('2026-04-07'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-04-02T09:00:00'));

            const result = await getInvitationDecision();

            expect(result.mailDate).toEqual(new Date('2026-04-02T09:00:00'));
        });
    });

    describe('bank holidays caching', () => {
        it('caches bank holidays and does not refetch within TTL', async () => {
            const mockFetch = vi.mocked(fetch);
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(createBankHolidaysResponse([])),
            } as Response);

            const gameDay = createMockGameDay({
                id: 1,
                date: new Date('2026-02-07'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-02-06T09:00:00'));

            await getInvitationDecision();
            await getInvitationDecision();

            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('falls back to empty set when API fails', async () => {
            vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

            const gameDay = createMockGameDay({
                id: 1,
                date: new Date('2026-02-07'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-02-06T09:00:00'));

            // Should still work, treating all weekdays as working days
            const result = await getInvitationDecision();
            expect(result.mailDate).toEqual(new Date('2026-02-06T09:00:00'));
        });

        it('falls back to empty set when API returns non-OK status', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            } as Response);

            const gameDay = createMockGameDay({
                id: 1,
                date: new Date('2026-02-07'),
                mailSent: null,
            });
            mockGameDayService.getUpcoming.mockResolvedValue(gameDay);
            vi.setSystemTime(new Date('2026-02-06T09:00:00'));

            const result = await getInvitationDecision();
            expect(result.mailDate).toEqual(new Date('2026-02-06T09:00:00'));
        });
    });
});
