import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, createMoreGameDaysCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    createMoreGameDaysCoreMock: vi.fn().mockResolvedValue([]),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/createMoreGameDays', () => ({
    createMoreGameDaysCore: createMoreGameDaysCoreMock,
}));


describe('createMoreGameDays action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, validates input, delegates to core, revalidates affected paths, and broadcasts Games channel');
    it.todo('returns the created game days from core');
    it.todo('propagates AuthError when requireAdmin throws without revalidating');
    it.todo('propagates ZodError when input validation fails');
});
