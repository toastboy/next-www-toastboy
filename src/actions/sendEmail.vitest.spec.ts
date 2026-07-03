import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireUserMock, sendEmailCoreMock } = vi.hoisted(() => ({
    requireUserMock: vi.fn().mockResolvedValue(undefined),
    sendEmailCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/auth.server', () => ({ requireUser: requireUserMock }));
vi.mock('@/lib/core/sendEmail', () => ({ sendEmailCore: sendEmailCoreMock }));

import { sendEmail } from '@/actions/sendEmail';

const mailOptions = {
    to: 'alice@example.com',
    subject: 'Hello',
    html: '<p>Hi Alice</p>',
};

describe('sendEmail action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireUser then delegates to sendEmailCore with the mail options', async () => {
        await sendEmail(mailOptions);

        expect(requireUserMock).toHaveBeenCalledTimes(1);
        expect(sendEmailCoreMock).toHaveBeenCalledWith(mailOptions);
    });

    it('propagates AuthError when requireUser throws without calling core', async () => {
        const authError = new Error('not authenticated');
        requireUserMock.mockRejectedValueOnce(authError);

        await expect(sendEmail(mailOptions)).rejects.toBe(authError);
        expect(sendEmailCoreMock).not.toHaveBeenCalled();
    });

    it('propagates errors from sendEmailCore', async () => {
        const coreError = new Error('smtp failure');
        sendEmailCoreMock.mockRejectedValueOnce(coreError);

        await expect(sendEmail(mailOptions)).rejects.toBe(coreError);
    });
});
