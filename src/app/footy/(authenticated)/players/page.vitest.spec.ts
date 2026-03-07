import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Player');
vi.mock('next/navigation');

describe('Players page', () => {
    it.todo('fetches current game day and all players in parallel via Promise.all');
    it.todo('calls notFound when there is no current game day');
    it.todo('passes players and gameDay to PlayerList');
    it.todo('handles service errors gracefully');
});
