import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, submitResponseCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    submitResponseCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/submitResponse', () => ({
    SubmitResponseCore: submitResponseCoreMock,
}));


describe('SubmitResponse action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, validates input, delegates to SubmitResponseCore, revalidates picker/responses/response paths, and broadcasts Responses channel');
    it.todo('returns the result from SubmitResponseCore');
    it.todo('propagates AuthError when requireAdmin throws without revalidating');
    it.todo('propagates ZodError when input validation fails');
});
