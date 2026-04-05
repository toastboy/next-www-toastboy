import { vi } from 'vitest';

const moneyService = {
    getDebts: vi.fn(),
    getChartData: vi.fn(),
    charge: vi.fn(),
    recordHallHire: vi.fn(),
    pay: vi.fn(),
    payMultiple: vi.fn(),
};

export default moneyService;
