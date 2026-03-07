import { vi } from 'vitest';

vi.mock('services/GameDay');

describe('Fixtures page', () => {
    it.todo('fetches allYears and current game day in parallel via Promise.all');
    it.todo('fetches fixtures filtered by selected year');
    it.todo('passes mailSent: false to getAll to select fixtures (not results)');
    it.todo('uses currentGameDay.id as the onOrAfter boundary');
    it.todo('handles missing currentGameDay (onOrAfter becomes undefined)');
    it.todo('defaults to year 0 (all-time) when no year param is provided');
    it.todo('parses the year from the first element of the catch-all param');
    it.todo('handles service errors gracefully');
});
