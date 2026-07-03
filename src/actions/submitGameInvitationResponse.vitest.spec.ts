import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, submitGameInvitationResponseCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    submitGameInvitationResponseCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/submitGameInvitationResponse', () => ({
    submitGameInvitationResponseCore: submitGameInvitationResponseCoreMock,
}));

import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    token: 'token-abc',
    response: 'Yes' as const,
    goalie: false,
    comment: null,
};

describe('submitGameInvitationResponse action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('validates input, delegates to core, revalidates picker/responses/response paths, and broadcasts Responses channel', async () => {
        await submitGameInvitationResponse(validInput);

        expect(submitGameInvitationResponseCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/picker');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/responses');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/response');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Responses);
    });

    it('returns the result from core', async () => {
        const outcome = { id: 1, response: 'Yes' };
        submitGameInvitationResponseCoreMock.mockResolvedValueOnce(outcome);

        const result = await submitGameInvitationResponse(validInput);

        expect(result).toBe(outcome);
    });

    it('propagates ZodError when input validation fails without revalidating', async () => {
        await expect(submitGameInvitationResponse({ ...validInput, token: '' })).rejects.toThrow();
        expect(submitGameInvitationResponseCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });
});
