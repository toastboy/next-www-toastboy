import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, submitResponseCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    submitResponseCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/submitResponse', () => ({
    SubmitResponseCore: submitResponseCoreMock,
}));

import { SubmitResponse } from '@/actions/submitResponse';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    gameDayId: 1249,
    playerId: 7,
    response: 'Yes' as const,
    goalie: false,
    comment: null,
};

describe('SubmitResponse action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to SubmitResponseCore, revalidates picker/responses/response paths, and broadcasts Responses channel', async () => {
        await SubmitResponse(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(submitResponseCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/picker');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/responses');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/response');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Responses);
    });

    it('returns the result from SubmitResponseCore', async () => {
        const outcome = { id: 1, response: 'Yes' };
        submitResponseCoreMock.mockResolvedValueOnce(outcome);

        const result = await SubmitResponse(validInput);

        expect(result).toBe(outcome);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(SubmitResponse(validInput)).rejects.toBe(authError);
        expect(submitResponseCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(SubmitResponse({ ...validInput, gameDayId: 0 })).rejects.toThrow();
        expect(submitResponseCoreMock).not.toHaveBeenCalled();
    });
});
