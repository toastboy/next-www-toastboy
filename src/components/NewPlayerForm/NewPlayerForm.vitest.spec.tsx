import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';

describe('NewPlayerForm', () => {
    const players = [
        createMockPlayerData({ id: 1, name: 'Sam Smith' }),
        createMockPlayerData({ id: 2, name: 'Alex Doe' }),
    ];
    const mockCreatePlayer = vi.fn(
        async () => Promise.resolve({
            player: { id: 1 },
            inviteLink: 'http://example.com/footy/auth/claim?token=abc',
        }),
    );
    const mockSendEmail = vi.fn(async () => Promise.resolve());

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form with inputs and submit button', () => {
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Introduced by/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('submits form with valid email', async () => {
        mockSendEmail.mockResolvedValueOnce(undefined);
        const user = userEvent.setup();

        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const nameInput = screen.getByLabelText(/Name/i);
        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await user.type(nameInput, 'Pat Smith');
        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreatePlayer).toHaveBeenCalledWith({
                name: 'Pat Smith',
                email: 'test@example.com',
                introducedBy: '',
            });
            expect(mockSendEmail).toHaveBeenCalledWith(
                {
                    to: 'test@example.com',
                    cc: 'footy@toastboy.co.uk',
                    subject: 'Welcome to Toastboy FC!',
                    html: expect.any(String) as string,
                },
            );
        });
    });

    it('shows loading notification while creating player', async () => {
        const notificationShowSpy = vi.spyOn(notifications, 'show');
        mockSendEmail.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const nameInput = screen.getByLabelText(/Name/i);
        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await user.type(nameInput, 'Pat Smith');
        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(notificationShowSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    loading: true,
                    title: 'Creating player',
                    message: 'Creating player...',
                }),
            );
        });
    });

    it('shows success notification on successful creation', async () => {
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        mockSendEmail.mockResolvedValueOnce(undefined);

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const nameInput = screen.getByLabelText(/Name/i);
        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await user.type(nameInput, 'Pat Smith');
        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    color: 'teal',
                    title: 'Player created',
                    message: 'Player created successfully',
                    loading: false,
                }),
            );
        });
    });

    it('shows error notification on creation failure', async () => {
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        mockCreatePlayer.mockRejectedValueOnce(new Error('Network error'));

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const nameInput = screen.getByLabelText(/Name/i);
        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await user.type(nameInput, 'Pat Smith');
        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    color: 'red',
                    title: 'Error',
                    loading: false,
                }),
            );
        });

        const [notification] = (notificationUpdateSpy.mock.calls[0] ?? []) as [{ message?: string }];
        expect(notification?.message ?? '').toContain('Error');
    });

    it('does not call sendEmail when form is submitted empty', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await user.click(submitButton);

        // Wait a bit to ensure no async calls happen
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(mockCreatePlayer).not.toHaveBeenCalled();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('accepts valid email input', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        await user.type(emailInput, 'valid@example.com');

        expect(emailInput).toHaveValue('valid@example.com');
    });

    it('email input is not required', () => {
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        expect(emailInput).not.toBeRequired();
    });

    it('form has correct email input attributes', () => {
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toHaveAttribute('inputmode', 'email');
        expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });

    it('requires name input', () => {
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput).toBeRequired();
    });

    it('renders introducer options', () => {
        render(
            <Wrapper>
                <NewPlayerForm
                    players={players}
                    onCreatePlayer={mockCreatePlayer}
                    onSendEmail={mockSendEmail}
                />
            </Wrapper>,
        );

        const introducerSelect = screen.getByLabelText(/Introduced by/i);
        expect(introducerSelect).toHaveDisplayValue('(Nobody)');
        expect(screen.getByRole('option', { name: 'Alex Doe' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Sam Smith' })).toBeInTheDocument();
    });
});
