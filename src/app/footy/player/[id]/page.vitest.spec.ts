import { vi } from 'vitest';

vi.mock('services/Player');
vi.mock('services/PlayerRecord');
vi.mock('services/Arse');
vi.mock('services/ClubSupporter');
vi.mock('services/CountrySupporter');
vi.mock('@/lib/auth.server');
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});
vi.mock('next/navigation');

describe('Player [id] page', () => {
    describe('unpackParams', () => {
        it.todo('looks up player by numeric id');
        it.todo('looks up player by login string when id is not numeric');
        it.todo('calls notFound when player cannot be found');
        it.todo('calls notFound when the year is not in the player\'s active years');
        it.todo('calls permanentRedirect when a login-based URL has a numeric canonical URL');
        it.todo('calls permanentRedirect when a year-based URL does not match the canonical URL');
    });

    describe('Page', () => {
        it.todo('fetches trophies for all tables in parallel via Promise.all');
        it.todo('calls getWinners with the player id for each table');
        it.todo('fetches lastPlayed, form, clubs, countries, arse, and record sequentially');
        it.todo('includes arse data only when the user role is admin');
        it.todo('passes null for arse when the user role is not admin');
        it.todo('passes trophies Map to PlayerProfile');
        it.todo('handles service errors gracefully');
    });
});
