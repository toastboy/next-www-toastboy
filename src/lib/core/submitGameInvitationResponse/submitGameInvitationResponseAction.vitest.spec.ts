import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, submitGameInvitationResponseCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    submitGameInvitationResponseCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/submitGameInvitationResponse', () => ({
    submitGameInvitationResponseCore: submitGameInvitationResponseCoreMock,
}));


describe('submitGameInvitationResponse action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('validates input, delegates to core, revalidates picker/responses/response paths, and broadcasts Responses channel');
    it.todo('returns the result from core');
    it.todo('propagates ZodError when input validation fails without revalidating');
});
