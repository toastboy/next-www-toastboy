import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('services/Player');
vi.mock('services/PlayerExtraEmail');
vi.mock('services/CountrySupporter');
vi.mock('services/ClubSupporter');
// The shared services/Outcome __mocks__ does not include getByPlayer, so this
// page's dependency is mocked locally instead.
vi.mock('services/Outcome', () => ({
    default: {
        getByPlayer: vi.fn(),
    },
}));
vi.mock('@/lib/auth.server');

vi.mock('@mantine/core', () => ({
    Notification: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/DownloadMyData/DownloadMyData', () => ({
    DownloadMyData: vi.fn(() => null),
}));

import { renderToStaticMarkup } from 'react-dom/server';

import Page from '@/app/footy/(authenticated)/downloadmydata/page';
import { DownloadMyData } from '@/components/DownloadMyData/DownloadMyData';
import { getCurrentUser } from '@/lib/auth.server';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import outcomeService from '@/services/Outcome';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import { createMockPlayer } from '@/tests/mocks/data/player';

const mockPlayer = createMockPlayer({ id: 7 });

describe('Download My Data page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getCurrentUser as Mock).mockResolvedValue({ playerId: 7, email: 'alice@example.com' });
        (playerService.getById as Mock).mockResolvedValue(mockPlayer);
        (playerExtraEmailService.getAll as Mock).mockResolvedValue([]);
        (countrySupporterService.getByPlayer as Mock).mockResolvedValue([]);
        (clubSupporterService.getByPlayer as Mock).mockResolvedValue([]);
        (outcomeService.getByPlayer as Mock).mockResolvedValue([]);
    });

    it('renders an error notification when the user has no playerId', async () => {
        (getCurrentUser as Mock).mockResolvedValue({ playerId: 0, email: 'alice@example.com' });

        const html = renderToStaticMarkup(await Page());

        expect(html).toContain('This account is not linked to a player profile yet.');
        expect(playerService.getById).not.toHaveBeenCalled();
    });

    it('renders an error notification when the user is not signed in', async () => {
        (getCurrentUser as Mock).mockResolvedValue(null);

        const html = renderToStaticMarkup(await Page());

        expect(html).toContain('This account is not linked to a player profile yet.');
    });

    it('fetches player, extraEmails, countries, clubs, and outcomes in parallel', async () => {
        await Page();

        expect(playerService.getById).toHaveBeenCalledWith(7);
        expect(playerExtraEmailService.getAll).toHaveBeenCalledWith(7);
        expect(countrySupporterService.getByPlayer).toHaveBeenCalledWith(7);
        expect(clubSupporterService.getByPlayer).toHaveBeenCalledWith(7);
        expect(outcomeService.getByPlayer).toHaveBeenCalledWith(7);
    });

    it('renders an error notification when the player record cannot be found', async () => {
        (playerService.getById as Mock).mockResolvedValue(null);

        const html = renderToStaticMarkup(await Page());

        expect(html).toContain('Failed to load player data.');
    });

    it('computes firstResponded and lastResponded correctly from outcomes', async () => {
        (outcomeService.getByPlayer as Mock).mockResolvedValue([
            createMockOutcome({ gameDayId: 10, response: 'Yes' }),
            createMockOutcome({ gameDayId: 5, response: 'No' }),
            createMockOutcome({ gameDayId: 20, response: null }),
        ]);

        renderToStaticMarkup(await Page());

        const [[props]] = (DownloadMyData as Mock).mock.calls as [{ data: { totals: { firstResponded: number | null; lastResponded: number | null } } }][];
        expect(props.data.totals.firstResponded).toBe(5);
        expect(props.data.totals.lastResponded).toBe(10);
    });

    it('computes firstPlayed and lastPlayed correctly from outcomes', async () => {
        (outcomeService.getByPlayer as Mock).mockResolvedValue([
            createMockOutcome({ gameDayId: 10, points: 3 }),
            createMockOutcome({ gameDayId: 5, points: 0 }),
            createMockOutcome({ gameDayId: 20, points: null }),
        ]);

        renderToStaticMarkup(await Page());

        const [[props]] = (DownloadMyData as Mock).mock.calls as [{ data: { totals: { firstPlayed: number | null; lastPlayed: number | null } } }][];
        expect(props.data.totals.firstPlayed).toBe(5);
        expect(props.data.totals.lastPlayed).toBe(10);
    });

    it('computes gamesPlayed, gamesWon, gamesDrawn, and gamesLost correctly', async () => {
        (outcomeService.getByPlayer as Mock).mockResolvedValue([
            createMockOutcome({ gameDayId: 1, points: 3 }),
            createMockOutcome({ gameDayId: 2, points: 3 }),
            createMockOutcome({ gameDayId: 3, points: 1 }),
            createMockOutcome({ gameDayId: 4, points: 0 }),
            createMockOutcome({ gameDayId: 5, points: null }),
        ]);

        renderToStaticMarkup(await Page());

        const [[props]] = (DownloadMyData as Mock).mock.calls as [{
            data: { totals: { gamesPlayed: number; gamesWon: number; gamesDrawn: number; gamesLost: number } };
        }][];
        expect(props.data.totals.gamesPlayed).toBe(4);
        expect(props.data.totals.gamesWon).toBe(2);
        expect(props.data.totals.gamesDrawn).toBe(1);
        expect(props.data.totals.gamesLost).toBe(1);
    });

    it('passes a JSON-serialised payload to DownloadMyData', async () => {
        (outcomeService.getByPlayer as Mock).mockResolvedValue([
            createMockOutcome({ gameDayId: 1, points: 3 }),
        ]);

        renderToStaticMarkup(await Page());

        const [[props]] = (DownloadMyData as Mock).mock.calls as [{ data: { profile: { joined: unknown } } }][];
        expect(typeof props.data.profile.joined).toBe('string');
    });

    it('defaults userEmail to null when the current user has no email', async () => {
        (getCurrentUser as Mock).mockResolvedValue({ playerId: 7, email: null });
        (outcomeService.getByPlayer as Mock).mockResolvedValue([
            createMockOutcome({ gameDayId: 1, points: 3 }),
        ]);

        renderToStaticMarkup(await Page());

        const [[props]] = (DownloadMyData as Mock).mock.calls as [{ data: { meta: { userEmail: string | null } } }][];
        expect(props.data.meta.userEmail).toBeNull();
    });

    it('handles service errors gracefully', async () => {
        (playerService.getById as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(Page()).rejects.toThrow('DB failed');
    });
});
