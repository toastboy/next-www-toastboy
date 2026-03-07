import { vi } from 'vitest';

vi.mock('services/Money');

describe('Admin Money page', () => {
    it.todo('calls moneyService.getBalances');
    it.todo('passes playerBalances, clubBalance, total, positiveTotal, and negativeTotal to MoneyForm');
    it.todo('handles service errors gracefully');
});
