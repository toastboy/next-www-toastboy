import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setGameResultCore } from '@/lib/actions/setGameResult';
import { SetGameResultInputSchema } from '@/types/actions/SetGameResult';

describe('setGameResultCore', () => {
    const gameDay = {
        id: 1249,
        year: 2026,
        date: new Date('2026-02-03T00:00:00Z'),
        game: true,
        mailSent: new Date('2026-02-01T09:00:00Z'),
        comment: null,
        bibs: null,
        pickerGamesHistory: 10 as const,
    };

    const gameDayService = {
        get: vi.fn(),
        update: vi.fn(),
    };

    const outcomeService = {
        getByGameDay: vi.fn(),
        upsert: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        gameDayService.get.mockResolvedValue(gameDay);
        gameDayService.update.mockResolvedValue({ ...gameDay, bibs: 'A' });
        outcomeService.getByGameDay.mockImplementation(async (_gameDayId: number, team: 'A' | 'B') => (
            Promise.resolve(team === 'A' ?
                [{ playerId: 1 }, { playerId: 2 }] :
                [{ playerId: 3 }, { playerId: 4 }],
            )));
        outcomeService.upsert.mockResolvedValue(undefined);
    });

    it('updates bibs and applies win/loss points', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        });

        await setGameResultCore(data, { gameDayService, outcomeService });

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            bibs: 'A',
        });

        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 1,
            points: 3,
        });
        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 3,
            points: 0,
        });
    });

    it('applies draw points to both teams', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'B',
            winner: 'draw',
        });

        await setGameResultCore(data, { gameDayService, outcomeService });

        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 2,
            points: 1,
        });
        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 4,
            points: 1,
        });
    });

    it('clears team points when winner is unset', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: null,
            winner: null,
        });

        await setGameResultCore(data, { gameDayService, outcomeService });

        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 1,
            points: null,
        });
        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 3,
            points: null,
        });
    });

    it('throws when the game day cannot be found', async () => {
        gameDayService.get.mockResolvedValue(null);

        await expect(setGameResultCore(
            {
                gameDayId: 9999,
                bibs: null,
                winner: null,
            },
            { gameDayService, outcomeService },
        )).rejects.toThrow('Game day not found (id: 9999).');

        expect(gameDayService.update).not.toHaveBeenCalled();
        expect(outcomeService.upsert).not.toHaveBeenCalled();
    });
});
