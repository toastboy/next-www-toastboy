import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('@/lib/auth.server');
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});
vi.mock('next/navigation');

describe('Game [id] page', () => {
    describe('unpackParams', () => {
        it.todo('calls notFound when the id param is not a valid positive integer');
        it.todo('calls notFound when the game day cannot be found');
        it.todo('calls permanentRedirect when the URL id does not match the canonical id');
    });

    describe('Page', () => {
        it.todo('fetches role, prevGame, nextGame, teamA, and teamB in parallel via Promise.all');
        it.todo('renders the GameResultForm only when the user role is admin');
        it.todo('renders the previous game navigation link when a previous game exists');
        it.todo('renders the next game navigation link when a next game exists');
        it.todo('omits navigation links when there is no previous or next game');
        it.todo('computes game winners from teamA and teamB');
        it.todo('handles service errors gracefully');
    });
});
