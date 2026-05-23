import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockClub, defaultClubList } from '@/tests/mocks/data/club';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountryList } from '@/tests/mocks/data/country';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { createMockPlayerExtraEmail, defaultPlayerExtraEmails } from '@/tests/mocks/data/playerExtraEmail';

describe('PlayerProfileForm', () => {
    const playerWithAccountEmail = {
        ...defaultPlayer,
        accountEmail: 'player@example.com',
    };

    const mockUpdatePlayer = vi.fn(
        async () => Promise.resolve(defaultPlayer),
    );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the profile fields', () => {
        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('textbox', { name: /^Name/ })).toBeInTheDocument();
        expect(screen.getByRole('switch', { name: /anonymous/i })).toBeInTheDocument();
        expect(screen.getByRole('switch', { name: /retired/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /account email/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /extra email address 1/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete extra email address 1/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add another email' })).toBeInTheDocument();
        expect(screen.getByLabelText('Year of Birth')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'National Team(s)' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Club(s)' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /^Comment/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Delete Account' })).toBeInTheDocument();
    });

    it('submits the form and shows a success notification', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        const nameInput = screen.getByRole('textbox', { name: /^Name/ });
        const submitButton = screen.getByRole('button', { name: 'Save Changes' });

        await user.clear(nameInput);
        await user.type(nameInput, `${defaultPlayer.name ?? ''} Jr`);
        await waitFor(() => {
            expect(submitButton).toBeEnabled();
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockUpdatePlayer).toHaveBeenCalledWith(
                playerWithAccountEmail.id,
                expect.objectContaining({
                    accountEmail: playerWithAccountEmail.accountEmail,
                    addedExtraEmails: [],
                    anonymous: playerWithAccountEmail.anonymous,
                    born: playerWithAccountEmail.born,
                    clubs: defaultClubSupporterDataList.map((entry) => entry.clubId),
                    comment: "",
                    countries: defaultCountrySupporterDataList.map((entry) => entry.country.fifaCode),
                    extraEmails: defaultPlayerExtraEmails.map((entry) => entry.email),
                    finished: playerWithAccountEmail.finished,
                    name: `${playerWithAccountEmail.name ?? ''} Jr`,
                    removedExtraEmails: [],
                }),
            );
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Profile updated',
                    message: 'Profile updated successfully',
                    color: 'teal',
                }),
            );
        });
    });

    it('shows an error notification and captures error when update fails', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        mockUpdatePlayer.mockRejectedValueOnce(new Error('Update failed'));

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        const nameInput = screen.getByRole('textbox', { name: /^Name/ });
        await user.clear(nameInput);
        await user.type(nameInput, `${defaultPlayer.name ?? ''} Jr`);
        await user.click(screen.getByRole('button', { name: 'Save Changes' }));

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    color: 'red',
                    title: 'Error',
                }),
            );
        });
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                layer: 'client',
                component: 'PlayerProfileForm',
                action: 'updateProfile',
            }),
        );
    });

    it('removes an extra email when its delete button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /delete extra email address 1/i }));

        expect(screen.queryByDisplayValue('gary.player@example.com')).not.toBeInTheDocument();
    });

    it('adds a new extra email input when the add button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('textbox', { name: /extra email address 2/i })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: /extra email address 3/i })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Add another email' }));

        expect(screen.getByRole('textbox', { name: /extra email address 3/i })).toBeInTheDocument();
    });

    it('submits with retired toggled on, passing a non-null finished date', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        const submitButton = screen.getByRole('button', { name: 'Save Changes' });
        await user.click(screen.getByRole('switch', { name: /retired/i }));
        await waitFor(() => {
            expect(submitButton).toBeEnabled();
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockUpdatePlayer).toHaveBeenCalledWith(
                playerWithAccountEmail.id,
                expect.objectContaining({ finished: expect.any(Object) as Date }),
            );
        });
    });

    it('initialises with a single empty email slot when no extra emails are provided', () => {
        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={[]}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('textbox', { name: /extra email address 1/i })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: /extra email address 2/i })).not.toBeInTheDocument();
    });

    it('shows a question-mark icon for an unverified extra email (verificationPending)', () => {
        const unverifiedEmail = createMockPlayerExtraEmail({
            id: 10,
            playerId: playerWithAccountEmail.id,
            email: 'pending@example.com',
            verifiedAt: null,
        });

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={[unverifiedEmail]}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Verification email has been sent/i)).toBeInTheDocument();
    });

    it('groups clubs with null country under "Unknown"', () => {
        const unknownClub = createMockClub({ id: 999, clubName: 'Mystery FC', country: null });

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={[...defaultClubList, unknownClub]}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('combobox', { name: 'Club(s)' })).toBeInTheDocument();
    });

    it('shows verified-email notification when verifiedEmail prop is provided', async () => {
        const notificationShowSpy = vi.spyOn(notifications, 'show');

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithAccountEmail}
                    accountEmail={playerWithAccountEmail.accountEmail}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    verifiedEmail="player@example.com"
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(notificationShowSpy).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Email verified', color: 'teal' }),
            );
        });
    });

    it('falls back to defaults for nullish player fields when no account email prop is provided', () => {
        const playerWithNullishFields = {
            ...defaultPlayer,
            name: null,
            born: null,
            anonymous: null,
            accountEmail: null,
        };

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={playerWithNullishFields}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={mockUpdatePlayer}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: /account email/i })).toHaveValue('');
        expect(screen.getByRole('switch', { name: /anonymous/i })).not.toBeChecked();
        expect(screen.getByLabelText('Year of Birth')).toHaveValue('');
    });
});
