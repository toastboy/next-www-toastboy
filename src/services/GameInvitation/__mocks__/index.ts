import { vi } from 'vitest';

const gameInvitationService = {
    get: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    upsertByUUID: vi.fn(),
    upsertByGameAndPlayer: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
};

export default gameInvitationService;
