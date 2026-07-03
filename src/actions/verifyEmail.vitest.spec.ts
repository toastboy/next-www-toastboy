import { beforeEach, describe, expect, it, vi } from 'vitest';

const { verifyEmailCoreMock, sendEmailVerificationCoreMock } = vi.hoisted(() => ({
    verifyEmailCoreMock: vi.fn(),
    sendEmailVerificationCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/core/verifyEmail', () => ({
    verifyEmailCore: verifyEmailCoreMock,
    sendEmailVerificationCore: sendEmailVerificationCoreMock,
}));

import { sendEmailVerification, verifyEmail } from '@/actions/verifyEmail';
import { defaultPlayer } from '@/tests/mocks/data/player';

describe('verifyEmail action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('delegates to verifyEmailCore with the token', async () => {
        await verifyEmail('token-abc');

        expect(verifyEmailCoreMock).toHaveBeenCalledWith('token-abc');
    });

    it('returns the result from verifyEmailCore', async () => {
        const result = { purpose: 'change-email', email: 'alice@example.com', playerId: 7 };
        verifyEmailCoreMock.mockResolvedValueOnce(result);

        const returned = await verifyEmail('token-abc');

        expect(returned).toBe(result);
    });

    it('propagates errors from verifyEmailCore', async () => {
        const coreError = new Error('email already belongs to another player');
        verifyEmailCoreMock.mockRejectedValueOnce(coreError);

        await expect(verifyEmail('bad-token')).rejects.toBe(coreError);
    });
});

describe('sendEmailVerification action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('delegates to sendEmailVerificationCore with the email and optional player', async () => {
        await sendEmailVerification('alice@example.com', defaultPlayer);

        expect(sendEmailVerificationCoreMock).toHaveBeenCalledWith('alice@example.com', defaultPlayer);
    });

    it('delegates to sendEmailVerificationCore without a player when none is provided', async () => {
        await sendEmailVerification('alice@example.com');

        expect(sendEmailVerificationCoreMock).toHaveBeenCalledWith('alice@example.com', undefined);
    });

    it('propagates errors from sendEmailVerificationCore', async () => {
        const coreError = new Error('failed to send verification email');
        sendEmailVerificationCoreMock.mockRejectedValueOnce(coreError);

        await expect(sendEmailVerification('alice@example.com')).rejects.toBe(coreError);
    });
});
