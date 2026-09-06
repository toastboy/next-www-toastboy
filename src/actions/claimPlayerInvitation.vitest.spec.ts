import { beforeEach, describe, expect, it, vi } from 'vitest';

const { coreClaimPlayerInvitationMock, coreFinalizePlayerInvitationClaimMock } =
    vi.hoisted(() => ({
        coreClaimPlayerInvitationMock: vi.fn(),
        coreFinalizePlayerInvitationClaimMock: vi
            .fn()
            .mockResolvedValue(undefined),
    }));

vi.mock('@/lib/core/claimPlayerInvitation', () => ({
    coreClaimPlayerInvitation: coreClaimPlayerInvitationMock,
    coreFinalizePlayerInvitationClaim: coreFinalizePlayerInvitationClaimMock,
}));

import {
    claimPlayerInvitation,
    finalizePlayerInvitationClaim,
} from '@/actions/claimPlayerInvitation';

describe('claimPlayerInvitation action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delegates to coreClaimPlayerInvitation with the token', async () => {
        await claimPlayerInvitation('token-abc');

        expect(coreClaimPlayerInvitationMock).toHaveBeenCalledWith('token-abc');
    });

    it('returns the result from coreClaimPlayerInvitation', async () => {
        const claimResult = { player: { id: 1 }, email: 'alice@example.com' };
        coreClaimPlayerInvitationMock.mockResolvedValueOnce(claimResult);

        const result = await claimPlayerInvitation('token-abc');

        expect(result).toBe(claimResult);
    });

    it('propagates errors from coreClaimPlayerInvitation', async () => {
        const coreError = new Error('invalid invitation');
        coreClaimPlayerInvitationMock.mockRejectedValueOnce(coreError);

        await expect(claimPlayerInvitation('bad-token')).rejects.toBe(
            coreError,
        );
    });
});

describe('finalizePlayerInvitationClaim action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delegates to coreFinalizePlayerInvitationClaim with the token', async () => {
        await finalizePlayerInvitationClaim('token-abc');

        expect(coreFinalizePlayerInvitationClaimMock).toHaveBeenCalledWith(
            'token-abc',
        );
    });

    it('propagates errors from coreFinalizePlayerInvitationClaim', async () => {
        const coreError = new Error('login account not found');
        coreFinalizePlayerInvitationClaimMock.mockRejectedValueOnce(coreError);

        await expect(finalizePlayerInvitationClaim('bad-token')).rejects.toBe(
            coreError,
        );
    });
});
