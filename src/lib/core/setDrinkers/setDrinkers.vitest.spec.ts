import { describe, expect, it, vi } from 'vitest';

import { setDrinkersCore } from '@/lib/core/setDrinkers';
import { APP_ERROR_CODE, InternalError, ValidationError } from '@/lib/errors';

const noop = vi.fn().mockResolvedValue(undefined);

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
                outcomeService: { getByGameDay, upsert },
                playerRecordService: { upsertFromGameDay: noop },
            },
        );

        expect(getByGameDay).toHaveBeenCalledWith(1249);

        expect(upsert).toHaveBeenCalledWith({ gameDayId: 1249, playerId: 1, pub: 1 });
        expect(upsert).toHaveBeenCalledWith({ gameDayId: 1249, playerId: 2, pub: 2 });
        expect(upsert).toHaveBeenCalledWith({ gameDayId: 1249, playerId: 3, pub: null });
        expect(upsert).toHaveBeenCalledWith({ gameDayId: 1249, playerId: 9, pub: null });

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
                outcomeService: { getByGameDay, upsert },
                playerRecordService: { upsertFromGameDay: noop },
            },
        );

        expect(getByGameDay).toHaveBeenCalledWith(1249);
        expect(upsert).toHaveBeenCalledTimes(1);
        expect(upsert).toHaveBeenCalledWith({ gameDayId: 1249, playerId: 7, pub: null });
        expect(result).toEqual({
            gameDayId: 1249,
            updated: 1,
            drinkers: 0,
        });
    });

    it('calls upsertFromGameDay with the gameDayId after updating outcomes', async () => {
        const upsertFromGameDay = vi.fn().mockResolvedValue(undefined);

        await setDrinkersCore(
            { gameDayId: 1249, players: [{ playerId: 1, drinker: true }] },
            {
                outcomeService: {
                    getByGameDay: vi.fn().mockResolvedValue([]),
                    upsert: vi.fn().mockResolvedValue(null),
                },
                playerRecordService: { upsertFromGameDay },
            },
        );

        expect(upsertFromGameDay).toHaveBeenCalledWith(1249);
    });

    it('throws InternalError with typed details when player-record update fails with a known error', async () => {
        const upsertFromGameDay = vi.fn().mockRejectedValue(new ValidationError('Nope'));

        let thrown: unknown;
        try {
            await setDrinkersCore(
                { gameDayId: 1249, players: [{ playerId: 1, drinker: true }] },
                {
                    outcomeService: {
                        getByGameDay: vi.fn().mockResolvedValue([]),
                        upsert: vi.fn().mockResolvedValue(null),
                    },
                    playerRecordService: { upsertFromGameDay },
                },
            );
        } catch (error) {
            thrown = error;
        }

        expect(thrown).toBeInstanceOf(InternalError);
        const appError = thrown as InternalError<{ gameDayId: number; operation: string; upstreamCode: string }>;
        expect(appError.code).toBe(APP_ERROR_CODE.Internal);
        expect(appError.publicMessage).toBe('Failed to update player records.');
        expect(appError.details).toEqual({
            gameDayId: 1249,
            operation: 'upsertFromGameDay',
            upstreamCode: APP_ERROR_CODE.Validation,
        });
        expect(appError.cause).toBeInstanceOf(ValidationError);
    });

    it('throws InternalError wrapping a plain error when player-record update fails unexpectedly', async () => {
        const sourceError = new Error('Database timeout');
        const upsertFromGameDay = vi.fn().mockRejectedValue(sourceError);

        let thrown: unknown;
        try {
            await setDrinkersCore(
                { gameDayId: 1249, players: [{ playerId: 1, drinker: true }] },
                {
                    outcomeService: {
                        getByGameDay: vi.fn().mockResolvedValue([]),
                        upsert: vi.fn().mockResolvedValue(null),
                    },
                    playerRecordService: { upsertFromGameDay },
                },
            );
        } catch (error) {
            thrown = error;
        }

        expect(thrown).toBeInstanceOf(InternalError);
        const appError = thrown as InternalError<{ gameDayId: number; operation: string; upstreamCode: string }>;
        expect(appError.code).toBe(APP_ERROR_CODE.Internal);
        expect(appError.publicMessage).toBe('Failed to update player records.');
        expect(appError.details).toEqual({
            gameDayId: 1249,
            operation: 'upsertFromGameDay',
            upstreamCode: APP_ERROR_CODE.Internal,
        });
        expect(appError.cause).toBeInstanceOf(InternalError);
        const normalizedCause = appError.cause as InternalError;
        expect(normalizedCause.cause).toBe(sourceError);
    });
});
