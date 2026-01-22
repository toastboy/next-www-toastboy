import { vi } from 'vitest';

const gameChatService = {
    get: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
};

export default gameChatService;
