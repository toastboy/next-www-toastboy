import { vi } from 'vitest';

const playerExtraEmailService = {
    getByEmail: vi.fn(),
    create: vi.fn(),
    upsert: vi.fn(),
    upsertAll: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
    deleteExcept: vi.fn(),
};

export default playerExtraEmailService;
