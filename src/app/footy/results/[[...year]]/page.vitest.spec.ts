import { vi } from 'vitest';

vi.mock('services/GameDay');

describe('Results page', () => {
    it.todo('fetches allYears and current game day in parallel via Promise.all');
    it.todo('fetches results filtered by selected year');
    it.todo('passes mailSent: true to getAll to select results (not fixtures)');
    it.todo('uses currentGameDay.id as the before boundary');
    it.todo('handles missing currentGameDay (before becomes undefined)');
    it.todo('defaults to year 0 (all-time) when no year param is provided');
    it.todo('parses the year from the first element of the catch-all param');
    it.todo('handles service errors gracefully');
});
