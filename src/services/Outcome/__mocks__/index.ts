import { vi } from 'vitest';
const outcomeService = {
    getByGameDay: vi.fn(),
    getTurnout: vi.fn(),
    getTurnoutByYear: vi.fn(),
};

export default outcomeService;
