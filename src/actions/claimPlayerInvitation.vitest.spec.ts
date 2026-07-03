import { beforeEach, describe, expect, it, vi } from 'vitest';

const { claimPlayerInvitationCoreMock, finalizePlayerInvitationClaimCoreMock } = vi.hoisted(() => ({
    claimPlayerInvitationCoreMock: vi.fn(),
    finalizePlayerInvitationClaimCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/core/claimPlayerInvitation', () => ({
    claimPlayerInvitationCore: claimPlayerInvitationCoreMock,
    finalizePlayerInvitationClaimCore: finalizePlayerInvitationClaimCoreMock,
}));

import { claimPlayerInvitation, finalizePlayerInvitationClaim } from '@/actions/claimPlayerInvitation';

describe('claimPlayerInvitation action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('delegates to claimPlayerInvitationCore with the token', async () => {
        await claimPlayerInvitation('token-abc');

        expect(claimPlayerInvitationCoreMock).toHaveBeenCalledWith('token-abc');
    });

    it('returns the result from claimPlayerInvitationCore', async () => {
        const claimResult = { player: { id: 1 }, email: 'alice@example.com' };
        claimPlayerInvitationCoreMock.mockResolvedValueOnce(claimResult);

        const result = await claimPlayerInvitation('token-abc');

        expect(result).toBe(claimResult);
    });

    it('propagates errors from claimPlayerInvitationCore', async () => {
        const coreError = new Error('invalid invitation');
        claimPlayerInvitationCoreMock.mockRejectedValueOnce(coreError);

        await expect(claimPlayerInvitation('bad-token')).rejects.toBe(coreError);
    });
});

describe('finalizePlayerInvitationClaim action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('delegates to finalizePlayerInvitationClaimCore with the token', async () => {
        await finalizePlayerInvitationClaim('token-abc');

        expect(finalizePlayerInvitationClaimCoreMock).toHaveBeenCalledWith('token-abc');
    });

    it('propagates errors from finalizePlayerInvitationClaimCore', async () => {
        const coreError = new Error('login account not found');
        finalizePlayerInvitationClaimCoreMock.mockRejectedValueOnce(coreError);

        await expect(finalizePlayerInvitationClaim('bad-token')).rejects.toBe(coreError);
    });
});
