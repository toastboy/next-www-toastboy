import { beforeEach, describe, it, vi } from 'vitest';

const { requireAdminMock, sendEmailToAllActivePlayersCoreMock } = vi.hoisted(() => ({
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    sendEmailToAllActivePlayersCoreMock: vi.fn(),
}));

vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/core/sendEmailToAllActivePlayers', () => ({
    sendEmailToAllActivePlayersCore: sendEmailToAllActivePlayersCoreMock,
}));


describe('sendEmailToAllActivePlayers action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin then delegates to sendEmailToAllActivePlayersCore with the mail options');
    it.todo('returns the recipient summary from core');
    it.todo('propagates AuthError when requireAdmin throws without calling core');
});
