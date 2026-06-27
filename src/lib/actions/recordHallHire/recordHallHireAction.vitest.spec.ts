import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, recordHallHireCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    recordHallHireCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/actions/recordHallHire', () => ({
    recordHallHireCore: recordHallHireCoreMock,
}));


describe('recordHallHire action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, validates input, delegates to core, revalidates money and invoice paths, and broadcasts Money channel');
    it.todo('propagates AuthError when requireAdmin throws without revalidating');
    it.todo('propagates ZodError when input validation fails');
});
