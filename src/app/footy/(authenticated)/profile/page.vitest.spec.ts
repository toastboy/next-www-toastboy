import { vi } from 'vitest';

vi.mock('services/Player');
vi.mock('services/PlayerExtraEmail');
vi.mock('services/CountrySupporter');
vi.mock('services/ClubSupporter');
vi.mock('services/Country');
vi.mock('services/Club');
vi.mock('@/lib/auth.server');

describe('Profile page', () => {
    it.todo('renders an error notification when the user has no playerId');
    it.todo('fetches player, extraEmails, countries, clubs, allCountries, and allClubs in parallel');
    it.todo('renders an error notification when the player record cannot be found');
    it.todo('passes all fetched data to PlayerProfileForm');
    it.todo('passes verifiedEmail when purpose is "player_email" and email is present');
    it.todo('passes undefined verifiedEmail for any other purpose value');
    it.todo('handles service errors gracefully');
});
