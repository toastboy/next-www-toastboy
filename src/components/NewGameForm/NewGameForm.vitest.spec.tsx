
import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { triggerInvitations } from '@/actions/triggerInvitations';
import { NewGameForm } from '@/components/NewGameForm/NewGameForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultInvitationDecision } from '@/tests/mocks';

const mockTriggerInvitations = triggerInvitations as MockedFunction<typeof triggerInvitations>;

describe('NewGameForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockTriggerInvitations.mockResolvedValue(defaultInvitationDecision);
    });

    it('renders the form fields', () => {
        render(
            <Wrapper>
                <NewGameForm />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Override time check/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Custom message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('submits the form and shows a ready notification', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <NewGameForm />
            </Wrapper>,
        );

        await user.click(screen.getByLabelText(/Override time check/i));
        await user.type(screen.getByLabelText(/Custom message/i), 'Let us know early.');
        await user.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(mockTriggerInvitations).toHaveBeenCalledWith({
                overrideTimeCheck: true,
                customMessage: 'Let us know early.',
            });
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Invitations ready',
                    message: 'Invitations can be sent now.',
                    color: 'teal',
                }),
            );
        });
    });

    it('shows an error notification when the request fails', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        mockTriggerInvitations.mockRejectedValue(new Error('Boom'));

        render(
            <Wrapper>
                <NewGameForm />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Error',
                    color: 'red',
                    message: 'Error: Boom',
                }),
            );
        });
    });
});
