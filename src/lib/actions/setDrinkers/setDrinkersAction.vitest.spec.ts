import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ValidationError } from '@/lib/errors';

const { revalidatePathMock, setDrinkersCoreMock, upsertFromGameDayMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    setDrinkersCoreMock: vi.fn(),
    upsertFromGameDayMock: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: revalidatePathMock,
}));

vi.mock('@/lib/actions/setDrinkers', () => ({
    setDrinkersCore: setDrinkersCoreMock,
}));

vi.mock('@/services/PlayerRecord', () => ({
    default: {
        upsertFromGameDay: upsertFromGameDayMock,
    },
}));

import { setDrinkers } from '@/actions/setDrinkers';

describe('setDrinkers action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns core result and revalidates affected pages on success', async () => {
        const coreResult = {
            gameDayId: 1249,
            updated: 4,
            drinkers: 2,
        };
        setDrinkersCoreMock.mockResolvedValue(coreResult);
        upsertFromGameDayMock.mockResolvedValue(undefined);

        const result = await setDrinkers({
            gameDayId: 1249,
            players: [
                { playerId: 1, drinker: true },
                { playerId: 2, drinker: false },
            ],
        });

        expect(setDrinkersCoreMock).toHaveBeenCalledWith({
            gameDayId: 1249,
            players: [
                { playerId: 1, drinker: true },
                { playerId: 2, drinker: false },
            ],
        });
        expect(upsertFromGameDayMock).toHaveBeenCalledWith(1249);
        expect(revalidatePathMock).toHaveBeenCalledTimes(5);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/drinkers');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/drinkers/1249');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/pub');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/table/pub');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/game/1249');
        expect(result).toEqual(coreResult);
    });

    it('throws a safe message when player record update fails with expected error', async () => {
        setDrinkersCoreMock.mockResolvedValue({
            gameDayId: 1249,
            updated: 4,
            drinkers: 2,
        });
        upsertFromGameDayMock.mockRejectedValue(new ValidationError('Nope'));

        await expect(setDrinkers({
            gameDayId: 1249,
            players: [
                { playerId: 1, drinker: true },
            ],
        })).rejects.toThrow(
            'Failed to update player records for game day 1249: Invalid request.',
        );

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('throws fallback message when player record update fails unexpectedly', async () => {
        setDrinkersCoreMock.mockResolvedValue({
            gameDayId: 1249,
            updated: 4,
            drinkers: 2,
        });
        upsertFromGameDayMock.mockRejectedValue(new Error('Database timeout'));

        await expect(setDrinkers({
            gameDayId: 1249,
            players: [
                { playerId: 1, drinker: true },
            ],
        })).rejects.toThrow(
            'Failed to update player records for game day 1249: Unknown error',
        );

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });
});
