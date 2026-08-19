import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setGameResultCore } from '@/lib/core/setGameResult';
import {
    APP_ERROR_CODE,
    InternalError,
    NotFoundError,
    ValidationError,
} from '@/lib/errors';
import { SetGameResultInputSchema } from '@/types/actions/SetGameResult';

describe('setGameResultCore', () => {
    const gameDay = {
        id: 1249,
        year: 2026,
        date: new Date('2026-02-03T00:00:00Z'),
        cost: 450,
        status: 'Scheduled' as const,
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
    };
    const transactionService = {
        charge: vi.fn(),
    };
    const playerRecordService = {
        upsertFromGameDay: vi.fn(),
    };

    const deps = () => ({
        gameDayService,
        outcomeService,
        transactionService,
        playerRecordService,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        gameDayService.get.mockResolvedValue(gameDay);
        gameDayService.update.mockResolvedValue({ ...gameDay, bibs: 'A' });
        outcomeService.getByGameDay.mockImplementation(
            async (_gameDayId: number, team: 'A' | 'B') =>
                Promise.resolve(
                    team === 'A'
                        ? [{ playerId: 1 }, { playerId: 2 }]
                        : [{ playerId: 3 }, { playerId: 4 }],
                ),
        );
        transactionService.charge.mockResolvedValue(undefined);
        playerRecordService.upsertFromGameDay.mockResolvedValue(undefined);
    });

    it('updates bibs and status when team A wins', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        });

        await setGameResultCore(data, deps());

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            bibs: 'A',
            status: 'AWin',
        });
    });

    it('sets status to Draw', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'B',
            winner: 'draw',
        });

        await setGameResultCore(data, deps());

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            bibs: 'B',
            status: 'Draw',
        });
    });

    it('sets status to BWin when team B wins', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'B',
        });

        await setGameResultCore(data, deps());

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            bibs: 'A',
            status: 'BWin',
        });
    });

    it('sets status to Scheduled when winner is unset', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: null,
            winner: null,
        });

        await setGameResultCore(data, deps());

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            bibs: null,
            status: 'Scheduled',
        });
    });

    it('charges every player on both teams', async () => {
        const data = SetGameResultInputSchema.parse({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        });

        await setGameResultCore(data, deps());

        expect(transactionService.charge).toHaveBeenCalledTimes(4);
        expect(transactionService.charge).toHaveBeenCalledWith(
            1,
            1249,
            gameDay.cost,
        );
        expect(transactionService.charge).toHaveBeenCalledWith(
            2,
            1249,
            gameDay.cost,
        );
        expect(transactionService.charge).toHaveBeenCalledWith(
            3,
            1249,
            gameDay.cost,
        );
        expect(transactionService.charge).toHaveBeenCalledWith(
            4,
            1249,
            gameDay.cost,
        );
    });

    it('throws when the game day cannot be found', async () => {
        gameDayService.get.mockResolvedValue(null);

        await expect(
            setGameResultCore(
                {
                    gameDayId: 9999,
                    bibs: null,
                    winner: null,
                },
                deps(),
            ),
        ).rejects.toBeInstanceOf(NotFoundError);

        expect(gameDayService.update).not.toHaveBeenCalled();
        expect(transactionService.charge).not.toHaveBeenCalled();
    });

    it('calls upsertFromGameDay with the gameDayId after updating outcomes', async () => {
        await setGameResultCore(
            SetGameResultInputSchema.parse({
                gameDayId: 1249,
                bibs: 'A',
                winner: 'A',
            }),
            deps(),
        );

        expect(playerRecordService.upsertFromGameDay).toHaveBeenCalledWith(
            1249,
        );
    });

    it('throws InternalError with typed details when player-record update fails with a known error', async () => {
        playerRecordService.upsertFromGameDay.mockRejectedValue(
            new ValidationError('Nope'),
        );

        let thrown: unknown;
        try {
            await setGameResultCore(
                SetGameResultInputSchema.parse({
                    gameDayId: 1249,
                    bibs: 'A',
                    winner: 'A',
                }),
                deps(),
            );
        } catch (error) {
            thrown = error;
        }

        expect(thrown).toBeInstanceOf(InternalError);
        const appError = thrown as InternalError<{
            gameDayId: number;
            operation: string;
            upstreamCode: string;
        }>;
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
                SetGameResultInputSchema.parse({
                    gameDayId: 1249,
                    bibs: 'A',
                    winner: 'A',
                }),
                deps(),
            );
        } catch (error) {
            thrown = error;
        }

        expect(thrown).toBeInstanceOf(InternalError);
        const appError = thrown as InternalError<{
            gameDayId: number;
            operation: string;
            upstreamCode: string;
        }>;
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
