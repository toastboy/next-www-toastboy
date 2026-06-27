import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, setGameEnabledCoreMock, sendEmailToAllActivePlayersMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    setGameEnabledCoreMock: vi.fn(),
    sendEmailToAllActivePlayersMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/setGameEnabled', () => ({
    setGameEnabledCore: setGameEnabledCoreMock,
}));
vi.mock('@/actions/sendEmailToAllActivePlayers', () => ({
    sendEmailToAllActivePlayers: sendEmailToAllActivePlayersMock,
}));


describe('setGameEnabled action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, validates input, delegates to core (passing the email action), revalidates affected paths, and broadcasts Games channel');
    it.todo('returns the updated gameDay from core');
    it.todo('passes sendEmailToAllActivePlayers as the email callback to setGameEnabledCore');
    it.todo('propagates AuthError when requireAdmin throws without revalidating');
    it.todo('propagates ZodError when input validation fails');
});
