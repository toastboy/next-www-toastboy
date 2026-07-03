import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() { return null; },
}));

vi.mock('@/components/MoreGamesForm/MoreGamesForm', () => ({
    MoreGamesForm: function MoreGamesForm() { return null; },
}));

import { createMoreGameDays } from '@/actions/createMoreGameDays';
import MoreGamesPage from '@/app/footy/admin/moregames/page';
import { config } from '@/lib/config';
import gameDayService from '@/services/GameDay';
import { findElement } from '@/tests/shared/reactTree';

describe('Admin More Games page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('calls gameDayService.getLatest', async () => {
        (gameDayService.getLatest as Mock).mockResolvedValue(null);

        await MoreGamesPage();

        expect(gameDayService.getLatest).toHaveBeenCalledTimes(1);
    });

    it('generates rows starting 7 days after the latest game day', async () => {
        (gameDayService.getLatest as Mock).mockResolvedValue({
            date: new Date('2026-02-03T18:00:00Z'),
            cost: 500,
            hallCost: 4700,
        });

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        const rows = form?.props.rows as { date: string }[];
        expect(rows[0]?.date).toBe('2026-02-10');
    });

    it('generates rows up to the end of the current booking year (July 31st)', async () => {
        (gameDayService.getLatest as Mock).mockResolvedValue({
            date: new Date('2026-02-03T18:00:00Z'),
            cost: 500,
            hallCost: 4700,
        });

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        const rows = form?.props.rows as { date: string }[];
        const lastRow = rows[rows.length - 1];

        expect(lastRow?.date <= '2026-07-31').toBe(true);
        expect(rows.every((row) => row.date <= '2026-07-31')).toBe(true);
    });

    it('falls back to the next Tuesday when there is no latest game day', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-02-04T12:00:00Z'));
        (gameDayService.getLatest as Mock).mockResolvedValue(null);

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        const rows = form?.props.rows as { date: string }[];
        expect(rows[0]?.date).toBe('2026-02-10');
        expect(new Date(rows[0].date).getDay()).toBe(2);
    });

    it('rolls the booking year end over to next year when the latest game day is in August or later', async () => {
        (gameDayService.getLatest as Mock).mockResolvedValue({
            date: new Date('2026-09-01T18:00:00Z'),
            cost: 500,
            hallCost: 4700,
        });

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        const rows = form?.props.rows as { date: string }[];
        const lastRow = rows[rows.length - 1];

        expect(lastRow?.date.startsWith('2027')).toBe(true);
        expect(lastRow?.date <= '2027-07-31').toBe(true);
        expect(rows.every((row) => row.date <= '2027-07-31')).toBe(true);
    });

    it('skips to the following Tuesday when the current day is already a Tuesday', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-02-03T12:00:00Z'));
        (gameDayService.getLatest as Mock).mockResolvedValue(null);

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        const rows = form?.props.rows as { date: string }[];
        expect(rows[0]?.date).toBe('2026-02-10');
    });

    it('uses the latest game day cost when available', async () => {
        (gameDayService.getLatest as Mock).mockResolvedValue({
            date: new Date('2026-02-03T18:00:00Z'),
            cost: 550,
            hallCost: 4200,
        });

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        expect(form?.props.cost).toBe(550);
        expect(form?.props.hallCost).toBe(4200);
    });

    it('falls back to the default game cost when no latest game day exists', async () => {
        (gameDayService.getLatest as Mock).mockResolvedValue(null);

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        expect(form?.props.cost).toBe(config.defaultGameCostPence);
        expect(form?.props.hallCost).toBe(config.defaultHallCostPence);
    });

    it('passes cost and rows to MoreGamesForm along with the createMoreGameDays action', async () => {
        (gameDayService.getLatest as Mock).mockResolvedValue(null);

        const result = await MoreGamesPage();

        const form = findElement(result, 'MoreGamesForm');
        expect(form?.props.onCreateMoreGameDays).toBe(createMoreGameDays);
        expect(Array.isArray(form?.props.rows)).toBe(true);
    });

    it('handles service errors gracefully by propagating them', async () => {
        (gameDayService.getLatest as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(MoreGamesPage()).rejects.toThrow('DB failed');
    });
});
