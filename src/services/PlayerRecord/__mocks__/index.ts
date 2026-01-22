import { vi } from 'vitest';
const playerRecordService = {
    getAll: vi.fn(),
    getAllYears: vi.fn(),
    getForYearByPlayer: vi.fn(),
    getProgress: vi.fn(),
    getTable: vi.fn(),
    getWinners: vi.fn(),
    deleteAll: vi.fn(),
    upsertForGameDay: vi.fn(),
};

export default playerRecordService;
