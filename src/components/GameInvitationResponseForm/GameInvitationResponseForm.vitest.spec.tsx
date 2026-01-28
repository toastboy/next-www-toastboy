import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultGameInvitationResponseDetails } from '@/tests/mocks/data/gameInvitationResponse';
import { SubmitGameInvitationResponseProxy } from '@/types/actions/SubmitGameInvitationResponse';

describe('GameInvitationResponseForm', () => {
    const mockSubmitGameInvitationResponse: SubmitGameInvitationResponseProxy = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the response form', () => {
        render(
            <Wrapper>
                <GameInvitationResponseForm details={defaultGameInvitationResponseDetails} onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse} />
            </Wrapper>,
        );

        expect(screen.getByText('Thanks for Your Response')).toBeInTheDocument();
        expect(screen.getByLabelText(/Response/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Goalie/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Optional comment/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Done/i })).toBeInTheDocument();
    });

    it('submits an updated response', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={defaultGameInvitationResponseDetails}
                    onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse}
                />
            </Wrapper>,
        );

        await user.selectOptions(screen.getByLabelText(/Response/i), 'Yes');
        await user.click(screen.getByLabelText(/Goalie/i));
        await user.type(screen.getByLabelText(/Optional comment/i), 'Looking forward to it.');
        await user.click(screen.getByRole('button', { name: /Done/i }));

        await waitFor(() => {
            expect(mockSubmitGameInvitationResponse).toHaveBeenCalledWith({
                token: defaultGameInvitationResponseDetails.token,
                response: 'Yes',
                goalie: true,
                comment: 'Looking forward to it.',
            });
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Response saved',
                    message: 'Your response has been updated.',
                }),
            );
        });
    });
});
