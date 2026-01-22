import { vi } from 'vitest';
const gameDayService = {
    get: vi.fn(),
    getAll: vi.fn(),
    getAllYears: vi.fn(),
    getYear: vi.fn(),
};

export default gameDayService;
