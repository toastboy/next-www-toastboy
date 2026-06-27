import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, triggerInvitationsCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    triggerInvitationsCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/actions/triggerInvitations', () => ({
    triggerInvitationsCore: triggerInvitationsCoreMock,
}));


describe('triggerInvitations action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, validates input, delegates to core, revalidates four affected paths, and broadcasts Invitations channel');
    it.todo('returns the invitation decision from core');
    it.todo('propagates AuthError when requireAdmin throws without revalidating');
    it.todo('propagates ZodError when input validation fails');
});
