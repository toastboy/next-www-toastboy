import { vi } from 'vitest';
const gameDayService = {
    getCurrent: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    getAllYears: vi.fn(),
    getYear: vi.fn(),
};

export default gameDayService;
