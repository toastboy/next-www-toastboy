import { vi } from 'vitest';

const emailVerificationService = {
    create: vi.fn(),
    getByToken: vi.fn(),
    markUsed: vi.fn(),
    deleteAll: vi.fn(),
};

export default emailVerificationService;
