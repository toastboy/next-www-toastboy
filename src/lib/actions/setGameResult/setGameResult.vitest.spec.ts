import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setGameResultCore } from '@/lib/actions/setGameResult';
import { APP_ERROR_CODE, InternalError, NotFoundError, ValidationError } from '@/lib/errors';
import { SetGameResultInputSchema } from '@/types/actions/SetGameResult';

describe('setGameResultCore', () => {
    const gameDay = {
        id: 1249,
        year: 2026,
        date: new Date('2026-02-03T00:00:00Z'),
        cost: 450,
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
    const transactionService = {
        charge: vi.fn(),
    };
    const playerRecordService = {
        upsertFromGameDay: vi.fn(),
    };

    const deps = () => ({ gameDayService, outcomeService, transactionService, playerRecordService });

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
        transactionService.charge.mockResolvedValue(undefined);
        playerRecordService.upsertFromGameDay.mockResolvedValue(undefined);
    });

    it('updates bibs and applies win/loss points', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        });

        await setGameResultCore(data, deps());

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

        await setGameResultCore(data, deps());

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

    it('applies win/loss points when team B wins', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'B',
        });

        await setGameResultCore(data, deps());

        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 1,
            points: 0,
        });
        expect(outcomeService.upsert).toHaveBeenCalledWith({
            gameDayId: 1249,
            playerId: 3,
            points: 3,
        });
    });

    it('clears team points when winner is unset', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: null,
            winner: null,
        });

        await setGameResultCore(data, deps());

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
            deps(),
        )).rejects.toBeInstanceOf(NotFoundError);

        expect(gameDayService.update).not.toHaveBeenCalled();
        expect(outcomeService.upsert).not.toHaveBeenCalled();
    });

    it('calls upsertFromGameDay with the gameDayId after updating outcomes', async () => {
        await setGameResultCore(
            SetGameResultInputSchema.parse({ gameDayId: 1249, bibs: 'A', winner: 'A' }),
            deps(),
        );

        expect(playerRecordService.upsertFromGameDay).toHaveBeenCalledWith(1249);
    });

    it('throws InternalError with typed details when player-record update fails with a known error', async () => {
        playerRecordService.upsertFromGameDay.mockRejectedValue(new ValidationError('Nope'));

        let thrown: unknown;
        try {
            await setGameResultCore(
                SetGameResultInputSchema.parse({ gameDayId: 1249, bibs: 'A', winner: 'A' }),
                deps(),
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
        playerRecordService.upsertFromGameDay.mockRejectedValue(sourceError);

        let thrown: unknown;
        try {
            await setGameResultCore(
                SetGameResultInputSchema.parse({ gameDayId: 1249, bibs: 'A', winner: 'A' }),
                deps(),
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
