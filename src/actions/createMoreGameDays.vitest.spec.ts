import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, createMoreGameDaysCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    createMoreGameDaysCoreMock: vi.fn().mockResolvedValue([]),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/createMoreGameDays', () => ({
    createMoreGameDaysCore: createMoreGameDaysCoreMock,
}));

import { createMoreGameDays } from '@/actions/createMoreGameDays';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    cost: 5,
    hallCost: 20,
    rows: [
        { date: '2026-03-01', game: true, comment: 'Season opener' },
    ],
};

describe('createMoreGameDays action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to core, revalidates affected paths, and broadcasts Games channel', async () => {
        await createMoreGameDays(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(createMoreGameDaysCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/moregames');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/fixtures');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Games);
    });

    it('returns the created game days from core', async () => {
        const created = [{ id: 1 }];
        createMoreGameDaysCoreMock.mockResolvedValueOnce(created);

        const result = await createMoreGameDays(validInput);

        expect(result).toBe(created);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(createMoreGameDays(validInput)).rejects.toBe(authError);
        expect(createMoreGameDaysCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(createMoreGameDays({ ...validInput, rows: [] })).rejects.toThrow();
        expect(createMoreGameDaysCoreMock).not.toHaveBeenCalled();
    });
});
