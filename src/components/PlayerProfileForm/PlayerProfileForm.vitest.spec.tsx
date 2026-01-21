

import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { updatePlayer } from '@/actions/updatePlayer';
import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { Wrapper } from '@/tests/components/lib/common';
import {
    defaultClubList,
    defaultClubSupporterDataList,
    defaultCountryList,
    defaultCountrySupporterDataList,
    defaultPlayer,
    defaultPlayerExtraEmails,
} from '@/tests/mocks';

const mockUpdatePlayer = updatePlayer as MockedFunction<typeof updatePlayer>;

describe('PlayerProfileForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUpdatePlayer.mockResolvedValue(defaultPlayer);
    });

    it('renders the profile fields', () => {
        render(
            <Wrapper>
                <PlayerProfileForm
                    player={defaultPlayer}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
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
                    player={defaultPlayer}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
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
                defaultPlayer.id,
                expect.objectContaining({
                    addedExtraEmails: [],
                    anonymous: defaultPlayer.anonymous,
                    born: defaultPlayer.born,
                    clubs: defaultClubSupporterDataList.map((entry) => entry.clubId.toString()),
                    countries: defaultCountrySupporterDataList.map((entry) => entry.country.isoCode),
                    extraEmails: defaultPlayerExtraEmails.map((entry) => entry.email),
                    finished: defaultPlayer.finished,
                    name: `${defaultPlayer.name ?? ''} Jr`,
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
});
