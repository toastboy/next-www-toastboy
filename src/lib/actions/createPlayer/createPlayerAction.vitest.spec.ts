import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, createPlayerCoreMock, addPlayerInviteCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    createPlayerCoreMock: vi.fn(),
    addPlayerInviteCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/actions/createPlayer', () => ({
    createPlayerCore: createPlayerCoreMock,
    addPlayerInviteCore: addPlayerInviteCoreMock,
}));


describe('createPlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, validates input, delegates to core, revalidates newplayer and players, and broadcasts Players channel');
    it.todo('returns the created player from core');
    it.todo('propagates AuthError when requireAdmin throws without revalidating');
    it.todo('propagates ZodError when input validation fails');
});

describe('addPlayerInvite action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, delegates to addPlayerInviteCore, revalidates affected paths, and broadcasts Players channel');
    it.todo('returns the invite link from core');
    it.todo('propagates AuthError when requireAdmin throws');
});
