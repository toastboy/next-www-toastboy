import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('next/navigation');

describe('Admin Picker page', () => {
    it.todo('calls notFound when there is no current game');
    it.todo('fetches admin outcomes for the current game day');
    it.todo('enriches each player with their all-time games played count via parallel Promise.all');
    it.todo('passes the current game day and enriched players to PickerForm');
    it.todo('handles service errors gracefully');
});
