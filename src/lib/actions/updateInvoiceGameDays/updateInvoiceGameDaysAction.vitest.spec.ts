import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, gameDayUpdateMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    gameDayUpdateMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/services/GameDay', () => ({
    default: {
        update: gameDayUpdateMock,
    },
}));


describe('updateInvoiceGameDays action', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, validates input, updates each game day in parallel, revalidates invoice and fixtures paths, and broadcasts Money and Games channels');
    it.todo('calls gameDayService.update once per game day with the correct id and gameScheduled flag');
    it.todo('propagates AuthError when requireAdmin throws without updating or revalidating');
    it.todo('propagates ZodError when input validation fails');
});
