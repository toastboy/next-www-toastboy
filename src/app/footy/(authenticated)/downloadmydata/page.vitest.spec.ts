import { vi } from 'vitest';

vi.mock('services/Player');
vi.mock('services/PlayerExtraEmail');
vi.mock('services/CountrySupporter');
vi.mock('services/ClubSupporter');
vi.mock('services/Outcome');
vi.mock('@/lib/auth.server');

describe('Download My Data page', () => {
    it.todo('renders an error notification when the user has no playerId');
    it.todo('fetches player, extraEmails, countries, clubs, and outcomes in parallel');
    it.todo('renders an error notification when the player record cannot be found');
    it.todo('computes firstResponded and lastResponded correctly from outcomes');
    it.todo('computes firstPlayed and lastPlayed correctly from outcomes');
    it.todo('computes gamesPlayed, gamesWon, gamesDrawn, and gamesLost correctly');
    it.todo('passes a JSON-serialised payload to DownloadMyData');
    it.todo('handles service errors gracefully');
});
