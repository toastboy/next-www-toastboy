jest.mock('@/actions/requestPlayerEmailVerification', () => ({
    requestPlayerEmailVerification: jest.fn(),
}));

jest.mock('@/actions/sendEmail', () => ({
    sendEmail: jest.fn(),
}));

jest.mock('@/actions/updatePlayer', () => ({
    updatePlayer: jest.fn(),
}));

import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { requestPlayerEmailVerification } from '@/actions/requestPlayerEmailVerification';
import { sendEmail } from '@/actions/sendEmail';
import { updatePlayer } from '@/actions/updatePlayer';
import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { Wrapper } from '@/tests/components/lib/common';
import {
    createMockPlayerEmail,
    defaultClubList,
    defaultClubSupporterDataList,
    defaultCountryList,
    defaultCountrySupporterDataList,
    defaultPlayer,
    defaultPlayerEmails,
} from '@/tests/mocks';

const mockUpdatePlayer = updatePlayer as jest.MockedFunction<typeof updatePlayer>;
const mockRequestVerification =
    requestPlayerEmailVerification as jest.MockedFunction<typeof requestPlayerEmailVerification>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

describe('PlayerProfileForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUpdatePlayer.mockResolvedValue(defaultPlayer);
    });

    it('renders the profile fields', () => {
        render(
            <Wrapper>
                <PlayerProfileForm
                    player={defaultPlayer}
                    emails={defaultPlayerEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Email address 1/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Year of Birth/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('submits the form and shows a success notification', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = jest.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={defaultPlayer}
                    emails={defaultPlayerEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(mockUpdatePlayer).toHaveBeenCalledWith(
                defaultPlayer.id,
                expect.objectContaining({
                    name: defaultPlayer.name,
                    anonymous: defaultPlayer.anonymous,
                    emails: defaultPlayerEmails.map((entry) => entry.email),
                    countries: defaultCountrySupporterDataList.map((entry) => entry.country.isoCode),
                    clubs: defaultClubSupporterDataList.map((entry) => entry.clubId.toString()),
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

    it('requests verification for an unverified email', async () => {
        const user = userEvent.setup();
        const unverifiedEmail = createMockPlayerEmail({
            id: 3,
            email: 'unverified@example.com',
            verifiedAt: null,
        });

        mockRequestVerification.mockResolvedValue({
            verificationLink: 'http://example.com/verify',
        } as Awaited<ReturnType<typeof requestPlayerEmailVerification>>);

        render(
            <Wrapper>
                <PlayerProfileForm
                    player={defaultPlayer}
                    emails={[unverifiedEmail]}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                />
            </Wrapper>,
        );

        await user.click(screen.getByLabelText(/Verify email address 1/i));

        await waitFor(() => {
            expect(mockRequestVerification).toHaveBeenCalledWith(
                defaultPlayer.id,
                'unverified@example.com',
            );
        });

        await waitFor(() => {
            expect(mockSendEmail).toHaveBeenCalledWith(
                'unverified@example.com',
                '',
                'Verify your email address',
                expect.stringContaining('http://example.com/verify'),
            );
        });
    });
});
