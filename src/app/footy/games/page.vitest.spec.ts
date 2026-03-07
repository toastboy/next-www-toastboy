import { vi } from 'vitest';

vi.mock('services/GameDay');

describe('Games page', () => {
    it.todo('fetches the count of games played and games remaining');
    it.todo('fetches both counts in parallel via Promise.all');
    it.todo('passes gamesPlayed and gamesRemaining to the rendered output');
    it.todo('handles service errors gracefully');
});
