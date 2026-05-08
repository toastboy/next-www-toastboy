import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type Editor, useEditor } from '@tiptap/react';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { SendEmailForm } from '@/components/SendEmailForm/SendEmailForm';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerData, defaultPlayerData } from '@/tests/mocks/data/playerData';

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

const mockUseEditor = useEditor as MockedFunction<typeof useEditor>;

describe('SendEmailForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders modal with subject input and send button', async () => {
        const onClose = vi.fn();
        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[defaultPlayerData]}
                    onClose={onClose}
                    onSendEmail={async () => Promise.resolve()}
                />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Send Mail/i })).toBeInTheDocument();
        });
    });

    it('renders nothing when editor is not yet initialised', () => {
        mockUseEditor.mockReturnValueOnce(null as unknown as Editor);

        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[defaultPlayerData]}
                    onClose={vi.fn()}
                    onSendEmail={async () => Promise.resolve()}
                />
            </Wrapper>,
        );

        expect(screen.queryByLabelText(/Subject/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Send Mail/i })).not.toBeInTheDocument();
        expect(screen.queryByText(/Send Mail to Players/i)).not.toBeInTheDocument();
    });

    it('sends to verified extra emails when available, alongside account email', async () => {
        const user = userEvent.setup();
        const onSendEmail = vi.fn().mockResolvedValue(undefined);

        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[defaultPlayerData]}
                    onClose={vi.fn()}
                    onSendEmail={onSendEmail}
                />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Subject/i), 'Test Subject');
        await user.click(screen.getByRole('button', { name: /Send Mail/i }));

        await waitFor(() => {
            expect(onSendEmail).toHaveBeenCalledWith(expect.objectContaining({
                to: 'gary.login@example.com,gary.player@example.com',
                subject: 'Test Subject',
            }));
        });
    });

    it('falls back to all extra emails when none are verified', async () => {
        const user = userEvent.setup();
        const onSendEmail = vi.fn().mockResolvedValue(undefined);
        const playerWithUnverifiedEmail = createMockPlayerData({
            accountEmail: null,
            extraEmails: [{ id: 2, playerId: 99, email: 'unverified@example.com', verifiedAt: null, createdAt: new Date() }],
        });

        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[playerWithUnverifiedEmail]}
                    onClose={vi.fn()}
                    onSendEmail={onSendEmail}
                />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Subject/i), 'Test');
        await user.click(screen.getByRole('button', { name: /Send Mail/i }));

        await waitFor(() => {
            expect(onSendEmail).toHaveBeenCalledWith(expect.objectContaining({
                to: 'unverified@example.com',
            }));
        });
    });

    it('deduplicates recipient addresses across players', async () => {
        const user = userEvent.setup();
        const onSendEmail = vi.fn().mockResolvedValue(undefined);
        const player1 = createMockPlayerData({ id: 1, accountEmail: 'shared@example.com', extraEmails: [] });
        const player2 = createMockPlayerData({ id: 2, accountEmail: 'shared@example.com', extraEmails: [] });

        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[player1, player2]}
                    onClose={vi.fn()}
                    onSendEmail={onSendEmail}
                />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Subject/i), 'Test');
        await user.click(screen.getByRole('button', { name: /Send Mail/i }));

        await waitFor(() => {
            expect(onSendEmail).toHaveBeenCalledWith(expect.objectContaining({
                to: 'shared@example.com',
            }));
        });
    });

    it('shows error notification and captures error when send fails', async () => {
        const user = userEvent.setup();
        const sendError = new Error('SMTP failure');
        const onSendEmail = vi.fn().mockRejectedValue(sendError);
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[defaultPlayerData]}
                    onClose={vi.fn()}
                    onSendEmail={onSendEmail}
                />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Subject/i), 'Test');
        await user.click(screen.getByRole('button', { name: /Send Mail/i }));

        await waitFor(() => {
            expect(captureUnexpectedError).toHaveBeenCalledWith(
                sendError,
                expect.objectContaining({ layer: 'client', component: 'SendEmailForm' }),
            );
        });
        expect(notificationUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
            color: 'red',
            title: 'Error',
            message: 'Failed to send email.',
        }));
    });
});
