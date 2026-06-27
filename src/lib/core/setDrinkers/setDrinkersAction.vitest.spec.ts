import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, setDrinkersCoreMock, requireAdminMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    setDrinkersCoreMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({
    revalidatePath: revalidatePathMock,
}));

vi.mock('@/lib/auth.server', () => ({
    requireAdmin: requireAdminMock,
}));

vi.mock('@/lib/core/setDrinkers', () => ({
    setDrinkersCore: setDrinkersCoreMock,
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
        expect(revalidatePathMock).toHaveBeenCalledTimes(5);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/drinkers');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/drinkers/1249');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/pub');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/table/pub');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/game/1249');
        expect(result).toEqual(coreResult);
    });

    it('propagates errors thrown by the core without calling revalidatePath', async () => {
        const coreError = new Error('core failed');
        setDrinkersCoreMock.mockRejectedValue(coreError);

        await expect(
            setDrinkers({ gameDayId: 1249, players: [{ playerId: 1, drinker: true }] }),
        ).rejects.toBe(coreError);

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });
});
