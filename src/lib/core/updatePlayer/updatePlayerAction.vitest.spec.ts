import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, updatePlayerCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    updatePlayerCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/updatePlayer', () => ({
    updatePlayerCore: updatePlayerCoreMock,
}));


describe('updatePlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('validates input, delegates to core with playerId, revalidates players/profile/player-detail paths, and broadcasts Players channel');
    it.todo('returns the updated player from core');
    it.todo('propagates ZodError when input validation fails without revalidating');
    it.todo('includes the playerId in the player-detail revalidation path');
});
