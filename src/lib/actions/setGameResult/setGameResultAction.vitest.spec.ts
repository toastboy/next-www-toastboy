import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, setGameResultCoreMock, requireAdminMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    setGameResultCoreMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({
    revalidatePath: revalidatePathMock,
}));

vi.mock('@/lib/auth.server', () => ({
    requireAdmin: requireAdminMock,
}));

vi.mock('@/lib/actions/setGameResult', () => ({
    setGameResultCore: setGameResultCoreMock,
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
        expect(revalidatePathMock).toHaveBeenCalledTimes(4);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/game/1249');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/table');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/pub');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/points');
        expect(result).toEqual(gameDay);
    });

    it('propagates errors thrown by the core without calling revalidatePath', async () => {
        const coreError = new Error('core failed');
        setGameResultCoreMock.mockRejectedValue(coreError);

        await expect(
            setGameResult({ gameDayId: 1249, bibs: 'A', winner: 'A' }),
        ).rejects.toBe(coreError);

        expect(revalidatePathMock).not.toHaveBeenCalled();
    });
});
