import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireUserMock, coreSendEmailMock } = vi.hoisted(() => ({
    requireUserMock: vi.fn().mockResolvedValue(undefined),
    coreSendEmailMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/auth.server', () => ({ requireUser: requireUserMock }));
vi.mock('@/lib/core/sendEmail', () => ({ coreSendEmail: coreSendEmailMock }));

import { sendEmail } from '@/actions/sendEmail';

const mailOptions = {
    to: 'alice@example.com',
    subject: 'Hello',
    html: '<p>Hi Alice</p>',
};

describe('sendEmail action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls requireUser then delegates to coreSendEmail with the mail options', async () => {
        await sendEmail(mailOptions);

        expect(requireUserMock).toHaveBeenCalledTimes(1);
        expect(coreSendEmailMock).toHaveBeenCalledWith(mailOptions);
    });

    it('propagates AuthError when requireUser throws without calling core', async () => {
        const authError = new Error('not authenticated');
        requireUserMock.mockRejectedValueOnce(authError);

        await expect(sendEmail(mailOptions)).rejects.toBe(authError);
        expect(coreSendEmailMock).not.toHaveBeenCalled();
    });

    it('propagates errors from coreSendEmail', async () => {
        const coreError = new Error('smtp failure');
        coreSendEmailMock.mockRejectedValueOnce(coreError);

        await expect(sendEmail(mailOptions)).rejects.toBe(coreError);
    });
});
