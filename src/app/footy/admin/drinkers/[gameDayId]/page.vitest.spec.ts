import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => {
        throw new Error('not_found');
    }),
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() {
        return null;
    },
}));

vi.mock('@/components/DrinkersForm/DrinkersForm', () => ({
    DrinkersForm: function DrinkersForm() {
        return null;
    },
}));

import { setDrinkers } from '@/actions/setDrinkers';
import DrinkersPage from '@/app/footy/admin/drinkers/[gameDayId]/page';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import { findElement } from '@/tests/shared/reactTree';
import { FootyChannel } from '@/types/FootyChannel';

const gameDay = { id: 1249, date: new Date('2026-02-14T18:00:00Z') };
const players = [{ playerId: 1, drinker: true }];

describe('Admin Drinkers [gameDayId] page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (gameDayService.get as Mock).mockResolvedValue(gameDay);
        (gameDayService.getPrevious as Mock).mockResolvedValue(null);
        (gameDayService.getNext as Mock).mockResolvedValue(null);
        (outcomeService.getAdminByGameDay as Mock).mockResolvedValue(players);
    });

    it('calls notFound when gameDayId is not a valid positive integer', async () => {
        await expect(
            DrinkersPage({
                params: Promise.resolve({ gameDayId: 'not-a-number' }),
            }),
        ).rejects.toThrow('not_found');

        await expect(
            DrinkersPage({ params: Promise.resolve({ gameDayId: '0' }) }),
        ).rejects.toThrow('not_found');

        expect(gameDayService.get).not.toHaveBeenCalled();
    });

    it('calls notFound when the game day cannot be found', async () => {
        (gameDayService.get as Mock).mockResolvedValue(null);

        await expect(
            DrinkersPage({ params: Promise.resolve({ gameDayId: '1249' }) }),
        ).rejects.toThrow('not_found');
    });

    it('fetches players, previousGame, and nextGame in parallel via Promise.all', async () => {
        await DrinkersPage({ params: Promise.resolve({ gameDayId: '1249' }) });

        expect(outcomeService.getAdminByGameDay).toHaveBeenCalledWith(1249);
        expect(gameDayService.getPrevious).toHaveBeenCalledWith(1249);
        expect(gameDayService.getNext).toHaveBeenCalledWith(1249);
    });

    it('passes previousGameId and nextGameId to DrinkersForm when adjacent games exist', async () => {
        (gameDayService.getPrevious as Mock).mockResolvedValue({ id: 1248 });
        (gameDayService.getNext as Mock).mockResolvedValue({ id: 1250 });

        const result = await DrinkersPage({
            params: Promise.resolve({ gameDayId: '1249' }),
        });

        const form = findElement(result, 'DrinkersForm');
        expect(form?.props.previousGameId).toBe(1248);
        expect(form?.props.nextGameId).toBe(1250);
    });

    it('passes undefined previousGameId/nextGameId when there is no adjacent game', async () => {
        (gameDayService.getPrevious as Mock).mockResolvedValue(null);
        (gameDayService.getNext as Mock).mockResolvedValue(null);

        const result = await DrinkersPage({
            params: Promise.resolve({ gameDayId: '1249' }),
        });

        const form = findElement(result, 'DrinkersForm');
        expect(form?.props.previousGameId).toBeUndefined();
        expect(form?.props.nextGameId).toBeUndefined();
    });

    it('passes the gameDay date as an ISO date string to DrinkersForm', async () => {
        const result = await DrinkersPage({
            params: Promise.resolve({ gameDayId: '1249' }),
        });

        const form = findElement(result, 'DrinkersForm');
        expect(form?.props.gameDate).toBe('2026-02-14');
        expect(form?.props.gameId).toBe(1249);
        expect(form?.props.players).toBe(players);
        expect(form?.props.setDrinkers).toBe(setDrinkers);
    });

    it('renders AutoRefresh subscribed to the Games channel', async () => {
        const result = await DrinkersPage({
            params: Promise.resolve({ gameDayId: '1249' }),
        });

        const autoRefresh = findElement(result, 'AutoRefresh');
        expect(autoRefresh?.props.channels).toBe(FootyChannel.Games);
    });

    it('handles service errors gracefully by propagating them', async () => {
        (gameDayService.get as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(
            DrinkersPage({ params: Promise.resolve({ gameDayId: '1249' }) }),
        ).rejects.toThrow('DB failed');
    });
});
