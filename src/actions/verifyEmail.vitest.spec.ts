import { beforeEach, describe, expect, it, vi } from 'vitest';

const { coreVerifyEmailMock, coreSendEmailVerificationMock } = vi.hoisted(
    () => ({
        coreVerifyEmailMock: vi.fn(),
        coreSendEmailVerificationMock: vi.fn().mockResolvedValue(undefined),
    }),
);

vi.mock('@/lib/core/verifyEmail', () => ({
    coreVerifyEmail: coreVerifyEmailMock,
    coreSendEmailVerification: coreSendEmailVerificationMock,
}));

import { sendEmailVerification, verifyEmail } from '@/actions/verifyEmail';
import { defaultPlayer } from '@/tests/mocks/data/player';

describe('verifyEmail action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delegates to coreVerifyEmail with the token', async () => {
        await verifyEmail('token-abc');

        expect(coreVerifyEmailMock).toHaveBeenCalledWith('token-abc');
    });

    it('returns the result from coreVerifyEmail', async () => {
        const result = {
            purpose: 'change-email',
            email: 'alice@example.com',
            playerId: 7,
        };
        coreVerifyEmailMock.mockResolvedValueOnce(result);

        const returned = await verifyEmail('token-abc');

        expect(returned).toBe(result);
    });

    it('propagates errors from coreVerifyEmail', async () => {
        const coreError = new Error('email already belongs to another player');
        coreVerifyEmailMock.mockRejectedValueOnce(coreError);

        await expect(verifyEmail('bad-token')).rejects.toBe(coreError);
    });
});

describe('sendEmailVerification action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delegates to coreSendEmailVerification with the email and optional player', async () => {
        await sendEmailVerification('alice@example.com', defaultPlayer);

        expect(coreSendEmailVerificationMock).toHaveBeenCalledWith(
            'alice@example.com',
            defaultPlayer,
        );
    });

    it('delegates to coreSendEmailVerification without a player when none is provided', async () => {
        await sendEmailVerification('alice@example.com');

        expect(coreSendEmailVerificationMock).toHaveBeenCalledWith(
            'alice@example.com',
            undefined,
        );
    });

    it('propagates errors from coreSendEmailVerification', async () => {
        const coreError = new Error('failed to send verification email');
        coreSendEmailVerificationMock.mockRejectedValueOnce(coreError);

        await expect(sendEmailVerification('alice@example.com')).rejects.toBe(
            coreError,
        );
    });
});
