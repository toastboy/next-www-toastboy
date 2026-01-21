import { vi } from 'vitest';
const playerService = {
    getById: vi.fn(),
    getForm: vi.fn(),
    getLastPlayed: vi.fn(),
    getLogin: vi.fn(),
    getName: vi.fn(),
    getYearsActive: vi.fn(),
};

export default playerService;
