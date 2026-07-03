import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('services/Player');
vi.mock('services/PlayerExtraEmail');
vi.mock('services/CountrySupporter');
vi.mock('services/ClubSupporter');
// The shared services/Country and services/Club __mocks__ only stub `get`, not
// `getAll`, so these dependencies are mocked locally instead.
vi.mock('services/Country', () => ({
    default: {
        getAll: vi.fn(),
    },
}));
vi.mock('services/Club', () => ({
    default: {
        getAll: vi.fn(),
    },
}));
vi.mock('@/lib/auth.server');

vi.mock('@mantine/core', () => ({
    Notification: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: vi.fn(() => null),
}));

vi.mock('@/components/PlayerProfileForm/PlayerProfileForm', () => ({
    PlayerProfileForm: vi.fn(() => null),
}));

import { renderToStaticMarkup } from 'react-dom/server';

import { updatePlayer } from '@/actions/updatePlayer';
import Page from '@/app/footy/(authenticated)/profile/page';
import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { getCurrentUser } from '@/lib/auth.server';
import clubService from '@/services/Club';
import clubSupporterService from '@/services/ClubSupporter';
import countryService from '@/services/Country';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import { createMockPlayer } from '@/tests/mocks/data/player';

const mockPlayer = createMockPlayer({ id: 7 });

describe('Profile page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getCurrentUser as Mock).mockResolvedValue({ playerId: 7, email: 'alice@example.com' });
        (playerService.getById as Mock).mockResolvedValue(mockPlayer);
        (playerExtraEmailService.getAll as Mock).mockResolvedValue([]);
        (countrySupporterService.getByPlayer as Mock).mockResolvedValue([]);
        (clubSupporterService.getByPlayer as Mock).mockResolvedValue([]);
        (countryService.getAll as Mock).mockResolvedValue([]);
        (clubService.getAll as Mock).mockResolvedValue([]);
    });

    it('renders an error notification when the user has no playerId', async () => {
        (getCurrentUser as Mock).mockResolvedValue({ playerId: undefined, email: 'alice@example.com' });

        const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }));

        expect(html).toContain('This account is not linked to a player profile yet.');
        expect(playerService.getById).not.toHaveBeenCalled();
    });

    it('fetches player, extraEmails, countries, clubs, allCountries, and allClubs in parallel', async () => {
        await Page({ searchParams: Promise.resolve({}) });

        expect(playerService.getById).toHaveBeenCalledWith(7);
        expect(playerExtraEmailService.getAll).toHaveBeenCalledWith(7);
        expect(countrySupporterService.getByPlayer).toHaveBeenCalledWith(7);
        expect(clubSupporterService.getByPlayer).toHaveBeenCalledWith(7);
        expect(countryService.getAll).toHaveBeenCalledTimes(1);
        expect(clubService.getAll).toHaveBeenCalledTimes(1);
    });

    it('renders an error notification when the player record cannot be found', async () => {
        (playerService.getById as Mock).mockResolvedValue(null);

        const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }));

        expect(html).toContain('Failed to load player profile.');
    });

    it('passes all fetched data to PlayerProfileForm', async () => {
        const extraEmails = [{ email: 'extra@example.com', verified: true }];
        const countries = [{ fifaCode: 'ENG' }];
        const clubs = [{ id: 1 }];
        const allCountries = [{ fifaCode: 'ENG', name: 'England' }];
        const allClubs = [{ id: 1, name: 'Arsenal' }];
        (playerExtraEmailService.getAll as Mock).mockResolvedValue(extraEmails);
        (countrySupporterService.getByPlayer as Mock).mockResolvedValue(countries);
        (clubSupporterService.getByPlayer as Mock).mockResolvedValue(clubs);
        (countryService.getAll as Mock).mockResolvedValue(allCountries);
        (clubService.getAll as Mock).mockResolvedValue(allClubs);

        renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }));

        expect(PlayerProfileForm).toHaveBeenCalledWith(
            {
                player: mockPlayer,
                accountEmail: 'alice@example.com',
                extraEmails,
                countries,
                clubs,
                allCountries,
                allClubs,
                verifiedEmail: undefined,
                onUpdatePlayer: updatePlayer,
            },
            undefined,
        );
    });

    it('passes verifiedEmail when purpose is "player_email" and email is present', async () => {
        renderToStaticMarkup(await Page({
            searchParams: Promise.resolve({ purpose: 'player_email', email: 'verified@example.com' }),
        }));

        const [[props]] = (PlayerProfileForm as Mock).mock.calls as [{ verifiedEmail?: string }][];
        expect(props.verifiedEmail).toBe('verified@example.com');
    });

    it('passes undefined verifiedEmail for any other purpose value', async () => {
        renderToStaticMarkup(await Page({
            searchParams: Promise.resolve({ purpose: 'reset_password', email: 'ignored@example.com' }),
        }));

        const [[props]] = (PlayerProfileForm as Mock).mock.calls as [{ verifiedEmail?: string }][];
        expect(props.verifiedEmail).toBeUndefined();
    });

    it('defaults to no purpose/email when searchParams is not provided', async () => {
        renderToStaticMarkup(await Page({}));

        const [[props]] = (PlayerProfileForm as Mock).mock.calls as [{ verifiedEmail?: string }][];
        expect(props.verifiedEmail).toBeUndefined();
    });

    it('handles service errors gracefully', async () => {
        (playerService.getById as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrow('DB failed');
    });
});
