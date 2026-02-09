import { vi } from 'vitest';
const outcomeService = {
    getAdminByGameDay: vi.fn(),
    getByGameDay: vi.fn(),
    getTurnout: vi.fn(),
    getTurnoutByYear: vi.fn(),
    getRecentGamePoints: vi.fn(),
    getRecentAverage: vi.fn(),
    getPlayerGamesPlayed: vi.fn(),
    getPlayerGamesPlayedBeforeGameDay: vi.fn(),
    upsert: vi.fn(),
};

export default outcomeService;
