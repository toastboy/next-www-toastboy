

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
import { defaultClubList } from '@/tests/mocks/data/club';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountryList } from '@/tests/mocks/data/country';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerExtraEmails } from '@/tests/mocks/data/playerExtraEmail';

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

        expect(screen.getByTestId('name-input')).toBeInTheDocument();
        expect(screen.getByTestId('anonymous-switch')).toBeInTheDocument();
        expect(screen.getByTestId('retired-switch')).toBeInTheDocument();
        expect(screen.getByTestId('account-email-input')).toBeInTheDocument();
        expect(screen.getByTestId('extra-email-input-0')).toBeInTheDocument();
        expect(screen.getByTestId('extra-email-delete-button-0')).toBeInTheDocument();
        expect(screen.getByTestId('add-extra-email-button')).toBeInTheDocument();
        expect(screen.getByTestId('born-input')).toBeInTheDocument();
        expect(screen.getByTestId('countries-multiselect')).toBeInTheDocument();
        expect(screen.getByTestId('clubs-multiselect')).toBeInTheDocument();
        expect(screen.getByTestId('comment-textarea')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        expect(screen.getByTestId('delete-button')).toBeInTheDocument();
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

        const nameInput = screen.getByTestId('name-input');
        const submitButton = screen.getByTestId('submit-button');

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

        await user.clear(screen.getByTestId('name-input'));
        await user.type(screen.getByTestId('name-input'), `${defaultPlayer.name ?? ''} Jr`);
        await user.click(screen.getByTestId('submit-button'));

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

        await user.click(screen.getByTestId('extra-email-delete-button-0'));

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

        expect(screen.getByTestId('extra-email-input-1')).toBeInTheDocument();
        expect(screen.queryByTestId('extra-email-input-2')).not.toBeInTheDocument();

        await user.click(screen.getByTestId('add-extra-email-button'));

        expect(screen.getByTestId('extra-email-input-2')).toBeInTheDocument();
    });
});
