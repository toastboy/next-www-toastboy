import { beforeEach, describe, it, vi } from 'vitest';

const { beforeDeletePlayerCoreMock, deletePlayerCoreMock } = vi.hoisted(() => ({
    beforeDeletePlayerCoreMock: vi.fn().mockResolvedValue(undefined),
    deletePlayerCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/core/deletePlayer', () => ({
    beforeDeletePlayerCore: beforeDeletePlayerCoreMock,
    deletePlayerCore: deletePlayerCoreMock,
}));


describe('beforeDeletePlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('delegates to beforeDeletePlayerCore with the provided user summary');
    it.todo('propagates errors from beforeDeletePlayerCore');
});

describe('deletePlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('delegates to deletePlayerCore');
    it.todo('propagates errors from deletePlayerCore');
});
