import { describe, expect, it, vi } from 'vitest';

import { setDrinkersCore } from '@/lib/actions/setDrinkers';

describe('setDrinkersCore', () => {
    it('sets pub to 1 for team players, 2 for non-team players, and clears non-drinkers', async () => {
        const getByGameDay = vi.fn().mockResolvedValue([
            { playerId: 1, team: 'A' },
            { playerId: 2, team: null },
            { playerId: 9, team: 'B' },
        ]);

        const upsert = vi.fn().mockResolvedValue(null);

        const result = await setDrinkersCore(
            {
                gameDayId: 1249,
                players: [
                    { playerId: 1, drinker: true },
                    { playerId: 2, drinker: true },
                    { playerId: 3, drinker: false },
                ],
            },
            {
                outcomeService: {
                    getByGameDay,
                    upsert,
                },
            },
        );

        expect(getByGameDay).toHaveBeenCalledWith(1249);

        expect(upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 1,
            pub: 1,
        });
        expect(upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 2,
            pub: 2,
        });
        expect(upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 3,
            pub: null,
        });
        expect(upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 9,
            pub: null,
        });

        expect(result).toEqual({
            gameDayId: 1249,
            updated: 4,
            drinkers: 2,
        });
    });

    it('deduplicates player entries using the last provided selection', async () => {
        const getByGameDay = vi.fn().mockResolvedValue([]);
        const upsert = vi.fn().mockResolvedValue(null);

        const result = await setDrinkersCore(
            {
                gameDayId: 1249,
                players: [
                    { playerId: 7, drinker: true },
                    { playerId: 7, drinker: false },
                ],
            },
            {
                outcomeService: {
                    getByGameDay,
                    upsert,
                },
            },
        );

        expect(getByGameDay).toHaveBeenCalledWith(1249);
        expect(upsert).toHaveBeenCalledTimes(1);
        expect(upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 7,
            pub: null,
        });
        expect(result).toEqual({
            gameDayId: 1249,
            updated: 1,
            drinkers: 0,
        });
    });
});
