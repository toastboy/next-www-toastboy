import { vi } from 'vitest';

vi.mock('services/Player');

describe('Admin New Player page', () => {
    it.todo('calls playerService.getAll to fetch existing players');
    it.todo('passes the existing players list to NewPlayerForm');
    it.todo('handles service errors gracefully');
});
