import { vi } from 'vitest';
const gameDayService = {
    get: vi.fn(),
    getAll: vi.fn(),
    getIdRangeForYear: vi.fn(),
    getByDate: vi.fn(),
    getCurrent: vi.fn(),
    getCurrentYear: vi.fn(),
    getUpcoming: vi.fn(),
    getPrevious: vi.fn(),
    getLatest: vi.fn(),
    getNext: vi.fn(),
    getGamesPlayed: vi.fn(),
    getGamesCancelled: vi.fn(),
    getGamesRemaining: vi.fn(),
    getSeasonEnders: vi.fn(),
    getAllYears: vi.fn(),
    getYear: vi.fn(),
    getForMonth: vi.fn(),
    create: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
    markMailSent: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
};

export default gameDayService;
