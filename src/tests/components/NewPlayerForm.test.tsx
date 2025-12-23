jest.mock('@/lib/mail', () => ({
    sendEmail: jest.fn(),
}));

jest.mock('@/actions/createPlayer', () => ({
    createPlayer: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        refresh: jest.fn(),
    })),
}));

import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createPlayer } from '@/actions/createPlayer';
import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import { sendEmail } from '@/lib/mail';
import { Wrapper } from '@/tests/components/lib/common';

const mockCreatePlayer = createPlayer as jest.MockedFunction<typeof createPlayer>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

describe('NewPlayerForm', () => {
    const players = [
        { id: 1, name: 'Sam Smith' },
        { id: 2, name: 'Alex Doe' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockCreatePlayer.mockResolvedValue({} as Awaited<ReturnType<typeof createPlayer>>);
    });

    it('renders form with inputs and submit button', () => {
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
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
                <NewPlayerForm players={players} />
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
                "test@example.com",
                "",
                "Welcome to Toastboy FC!",
                "&&&& Detailed welcome text goes here: how to log on, where to find info, rules, etc. &&&&",
            );
        });
    });

    it('shows loading notification while creating player', async () => {
        const notificationShowSpy = jest.spyOn(notifications, 'show');
        mockSendEmail.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
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
        const notificationUpdateSpy = jest.spyOn(notifications, 'update');
        mockSendEmail.mockResolvedValueOnce(undefined);

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
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
        const notificationUpdateSpy = jest.spyOn(notifications, 'update');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockCreatePlayer.mockRejectedValueOnce(new Error('Network error'));

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
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
                    message: expect.stringContaining('Error'),
                    loading: false,
                }),
            );
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to create player:',
            expect.any(Error),
        );

        consoleErrorSpy.mockRestore();
    });

    it('does not call sendEmail when form is submitted empty', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
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
                <NewPlayerForm players={players} />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        await user.type(emailInput, 'valid@example.com');

        expect(emailInput).toHaveValue('valid@example.com');
    });

    it('email input is required', () => {
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        expect(emailInput).toBeRequired();
    });

    it('form has correct email input attributes', () => {
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
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
                <NewPlayerForm players={players} />
            </Wrapper>,
        );

        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput).toBeRequired();
    });

    it('renders introducer options', () => {
        render(
            <Wrapper>
                <NewPlayerForm players={players} />
            </Wrapper>,
        );

        const introducerSelect = screen.getByLabelText(/Introduced by/i);
        expect(introducerSelect).toHaveDisplayValue('(Nobody)');
        expect(screen.getByRole('option', { name: 'Alex Doe' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Sam Smith' })).toBeInTheDocument();
    });
});
