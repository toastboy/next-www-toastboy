jest.mock('@/lib/mail', () => ({
    sendEmail: jest.fn(),
}));

import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import { sendEmail } from '@/lib/mail';
import { Wrapper } from '@/tests/components/lib/common';

const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

describe('NewPlayerForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form with email input and submit button', () => {
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('submits form with valid email', async () => {
        mockSendEmail.mockResolvedValueOnce(undefined);
        const user = userEvent.setup();

        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSendEmail).toHaveBeenCalledWith(
                'test@example.com',
                'Test subject',
                'Test body',
            );
        });
    });

    it('shows loading notification while sending', async () => {
        const notificationShowSpy = jest.spyOn(notifications, 'show');
        mockSendEmail.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(notificationShowSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    loading: true,
                    title: 'Sending email',
                    message: 'Sending email...',
                }),
            );
        });
    });

    it('shows success notification on successful send', async () => {
        const notificationUpdateSpy = jest.spyOn(notifications, 'update');
        mockSendEmail.mockResolvedValueOnce(undefined);

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    color: 'teal',
                    title: 'Email sent',
                    message: 'Email sent successfully',
                    loading: false,
                }),
            );
        });
    });

    it('shows error notification on send failure', async () => {
        const notificationUpdateSpy = jest.spyOn(notifications, 'update');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockSendEmail.mockRejectedValueOnce(new Error('Network error'));

        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

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
            'Failed to send:',
            expect.any(Error),
        );

        consoleErrorSpy.mockRestore();
    });

    it('does not call sendEmail when form is submitted empty', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await user.click(submitButton);

        // Wait a bit to ensure no async calls happen
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('accepts valid email input', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        await user.type(emailInput, 'valid@example.com');

        expect(emailInput).toHaveValue('valid@example.com');
    });

    it('email input is required', () => {
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        expect(emailInput).toBeRequired();
    });

    it('form has correct email input attributes', () => {
        render(
            <Wrapper>
                <NewPlayerForm />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email address/i);
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toHaveAttribute('inputmode', 'email');
        expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });
});

