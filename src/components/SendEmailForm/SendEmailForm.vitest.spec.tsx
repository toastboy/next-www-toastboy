import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type Editor, useEditor } from '@tiptap/react';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { SendEmailForm } from '@/components/SendEmailForm/SendEmailForm';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';
import type { PlayerDataEmailDisplayType } from '@/types';

const defaultEmailPlayer: PlayerDataEmailDisplayType = {
    id: 1,
    name: 'Gary Player',
    accountEmail: 'gary.login@example.com',
    extraEmails: [{ email: 'gary.player@example.com', verified: true }],
};

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
                    players={[defaultEmailPlayer]}
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
                    players={[defaultEmailPlayer]}
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
                    players={[defaultEmailPlayer]}
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
        const playerWithUnverifiedEmail: PlayerDataEmailDisplayType = {
            id: 99,
            name: 'Test Player',
            accountEmail: null,
            extraEmails: [{ email: 'unverified@example.com', verified: false }],
        };

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
        const player1: PlayerDataEmailDisplayType = { id: 1, name: 'Player One', accountEmail: 'shared@example.com', extraEmails: [] };
        const player2: PlayerDataEmailDisplayType = { id: 2, name: 'Player Two', accountEmail: 'shared@example.com', extraEmails: [] };

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

    it('deduplicates addresses that differ only by case', async () => {
        const user = userEvent.setup();
        const onSendEmail = vi.fn().mockResolvedValue(undefined);
        const player1: PlayerDataEmailDisplayType = { id: 1, name: 'Player One', accountEmail: 'Alice@example.com', extraEmails: [] };
        const player2: PlayerDataEmailDisplayType = { id: 2, name: 'Player Two', accountEmail: 'alice@example.com', extraEmails: [] };

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
                to: 'alice@example.com',
            }));
        });
    });

    it('trims whitespace from addresses before sending', async () => {
        const user = userEvent.setup();
        const onSendEmail = vi.fn().mockResolvedValue(undefined);
        const player: PlayerDataEmailDisplayType = { id: 1, name: 'Player One', accountEmail: ' padded@example.com ', extraEmails: [] };

        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[player]}
                    onClose={vi.fn()}
                    onSendEmail={onSendEmail}
                />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Subject/i), 'Test');
        await user.click(screen.getByRole('button', { name: /Send Mail/i }));

        await waitFor(() => {
            expect(onSendEmail).toHaveBeenCalledWith(expect.objectContaining({
                to: 'padded@example.com',
            }));
        });
    });

    it('disables submit button when no valid email addresses exist', async () => {
        const noEmailPlayer: PlayerDataEmailDisplayType = {
            id: 99,
            name: 'No Email Player',
            accountEmail: null,
            extraEmails: [],
        };

        render(
            <Wrapper>
                <SendEmailForm
                    opened={true}
                    players={[noEmailPlayer]}
                    onClose={vi.fn()}
                    onSendEmail={vi.fn()}
                />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Send Mail/i })).toBeDisabled();
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
                    players={[defaultEmailPlayer]}
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
