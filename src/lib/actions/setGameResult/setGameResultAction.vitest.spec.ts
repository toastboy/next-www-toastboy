import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ValidationError } from '@/lib/errors';

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

    it('throws a safe message when player record update fails with expected error', async () => {
        setGameResultCoreMock.mockResolvedValue({ id: 1249 });
        upsertFromGameDayMock.mockRejectedValue(new ValidationError('Nope'));

        await expect(setGameResult({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        })).rejects.toThrow(
            'Failed to update player records for game day 1249: Invalid request.',
        );

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('throws fallback message when player record update fails unexpectedly', async () => {
        setGameResultCoreMock.mockResolvedValue({ id: 1249 });
        upsertFromGameDayMock.mockRejectedValue(new Error('Database timeout'));

        await expect(setGameResult({
            gameDayId: 1249,
            bibs: 'A',
            winner: 'A',
        })).rejects.toThrow(
            'Failed to update player records for game day 1249: Unknown error',
        );

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });
});
