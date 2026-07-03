import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdminMock, sendEmailToAllActivePlayersCoreMock } = vi.hoisted(() => ({
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    sendEmailToAllActivePlayersCoreMock: vi.fn(),
}));

vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/core/sendEmailToAllActivePlayers', () => ({
    sendEmailToAllActivePlayersCore: sendEmailToAllActivePlayersCoreMock,
}));

import { sendEmailToAllActivePlayers } from '@/actions/sendEmailToAllActivePlayers';

const mailOptions = {
    subject: 'Season update',
    html: '<p>Hello everyone</p>',
};

describe('sendEmailToAllActivePlayers action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin then delegates to sendEmailToAllActivePlayersCore with the mail options', async () => {
        await sendEmailToAllActivePlayers(mailOptions);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(sendEmailToAllActivePlayersCoreMock).toHaveBeenCalledWith(mailOptions);
    });

    it('returns the recipient summary from core', async () => {
        const summary = { recipientCount: 12 };
        sendEmailToAllActivePlayersCoreMock.mockResolvedValueOnce(summary);

        const result = await sendEmailToAllActivePlayers(mailOptions);

        expect(result).toBe(summary);
    });

    it('propagates AuthError when requireAdmin throws without calling core', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(sendEmailToAllActivePlayers(mailOptions)).rejects.toBe(authError);
        expect(sendEmailToAllActivePlayersCoreMock).not.toHaveBeenCalled();
    });
});
