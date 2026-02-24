import { beforeEach, describe, expect, it, vi } from 'vitest';

import { APP_ERROR_CODE, InternalError, ValidationError } from '@/lib/errors';

const { revalidatePathMock, setGameResultCoreMock, upsertFromGameDayMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    setGameResultCoreMock: vi.fn(),
    upsertFromGameDayMock: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: revalidatePathMock,
}));

vi.mock('@/lib/actions/setGameResult', () => ({
    setGameResultCore: setGameResultCoreMock,
}));

vi.mock('@/services/PlayerRecord', () => ({
    default: {
        upsertFromGameDay: upsertFromGameDayMock,
    },
}));

import { setGameResult } from '@/actions/setGameResult';

describe('setGameResult action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns core result and revalidates affected pages on success', async () => {
        const gameDay = {
            id: 1249,
            bibs: 'A',
        };
        setGameResultCoreMock.mockResolvedValue(gameDay);
        upsertFromGameDayMock.mockResolvedValue(undefined);

        const result = await setGameResult({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        });

        expect(setGameResultCoreMock).toHaveBeenCalledWith({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        });
        expect(upsertFromGameDayMock).toHaveBeenCalledWith(1249);
        expect(revalidatePathMock).toHaveBeenCalledTimes(4);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/game/1249');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/table');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/pub');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/points');
        expect(result).toEqual(gameDay);
    });

    it('throws typed InternalError with validation upstreamCode when player-record update fails', async () => {
        setGameResultCoreMock.mockResolvedValue({ id: 1249 });
        upsertFromGameDayMock.mockRejectedValue(new ValidationError('Nope'));

        let thrown: unknown;
        try {
            await setGameResult({
                gameDayId: 1249,
                bibs: 'A',
                winner: 'A',
            });
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

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('throws typed InternalError with internal upstreamCode when player-record update fails unexpectedly', async () => {
        setGameResultCoreMock.mockResolvedValue({ id: 1249 });
        const sourceError = new Error('Database timeout');
        upsertFromGameDayMock.mockRejectedValue(sourceError);

        let thrown: unknown;
        try {
            await setGameResult({
                gameDayId: 1249,
                bibs: 'A',
                winner: 'A',
            });
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

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });
});
