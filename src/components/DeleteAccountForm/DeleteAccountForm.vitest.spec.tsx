import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { DeleteAccountForm } from '@/components/DeleteAccountForm/DeleteAccountForm';
import { Wrapper } from '@/tests/components/lib/common';
import type { DeletePlayerProxy } from '@/types/actions/DeletePlayer';

describe('DeleteAccountForm', () => {
    const mockDeletePlayer: DeletePlayerProxy = vi
        .fn()
        .mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the confirmation fields and submit button', () => {
        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={mockDeletePlayer} />
            </Wrapper>,
        );

        expect(
            screen.getByRole('textbox', { name: /type delete to confirm/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', {
                name: /i understand.*personal data/i,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Delete my data' }),
        ).toBeInTheDocument();
    });

    it('validates required confirmation inputs', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={mockDeletePlayer} />
            </Wrapper>,
        );

        await user.click(
            screen.getByRole('button', { name: 'Delete my data' }),
        );

        const confirmPhraseInput = screen.getByRole('textbox', {
            name: /type delete to confirm/i,
        });
        const confirmPhraseErrorId =
            confirmPhraseInput.getAttribute('aria-describedby');
        expect(confirmPhraseErrorId).toBeTruthy();

        const confirmPhraseError = confirmPhraseErrorId
            ? document.getElementById(confirmPhraseErrorId)
            : null;
        expect(confirmPhraseError).toBeTruthy();
        expect(confirmPhraseError?.textContent ?? '').toBe(
            'Type DELETE to confirm',
        );

        const confirmPiiInput = screen.getByRole('checkbox', {
            name: /i understand.*personal data/i,
        });
        const confirmPiiRoot = confirmPiiInput.closest(
            '.mantine-Checkbox-root',
        );
        expect(confirmPiiRoot).toBeTruthy();
        expect(confirmPiiRoot?.textContent ?? '').toContain(
            'Please confirm deletion of your personal data',
        );
    });

    it('submits the form and shows a success message', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={mockDeletePlayer} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /type delete to confirm/i }),
            'DELETE',
        );
        await user.click(
            screen.getByRole('checkbox', {
                name: /i understand.*personal data/i,
            }),
        );
        await user.click(
            screen.getByRole('button', { name: 'Delete my data' }),
        );

        await waitFor(() => {
            expect(mockDeletePlayer).toHaveBeenCalledTimes(1);
        });

        expect(await screen.findByRole('alert')).toBeInTheDocument();
    });

    it('shows a loading state on submit and clears it after a successful deletion', async () => {
        const user = userEvent.setup();
        let resolveDelete: () => void = () => undefined;
        const pending = new Promise<void>((resolve) => {
            resolveDelete = resolve;
        });
        const slowMock: DeletePlayerProxy = vi.fn().mockReturnValue(pending);

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={slowMock} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /type delete to confirm/i }),
            'DELETE',
        );
        await user.click(
            screen.getByRole('checkbox', {
                name: /i understand.*personal data/i,
            }),
        );
        const submitButton = screen.getByRole('button', {
            name: 'Delete my data',
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(submitButton).toHaveAttribute('data-loading', 'true');
        });

        resolveDelete();

        await waitFor(() => {
            expect(submitButton).not.toHaveAttribute('data-loading', 'true');
        });
    });

    it('clears the loading state after a failed deletion', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        const failingMock: DeletePlayerProxy = vi
            .fn()
            .mockRejectedValueOnce(new Error('Delete failed'));

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={failingMock} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /type delete to confirm/i }),
            'DELETE',
        );
        await user.click(
            screen.getByRole('checkbox', {
                name: /i understand.*personal data/i,
            }),
        );
        const submitButton = screen.getByRole('button', {
            name: 'Delete my data',
        });
        await user.click(submitButton);

        await screen.findByRole('alert');
        expect(submitButton).not.toHaveAttribute('data-loading', 'true');

        consoleErrorSpy.mockRestore();
    });

    it('shows an error message when deletion fails', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        const failingMock: DeletePlayerProxy = vi
            .fn()
            .mockRejectedValueOnce(new Error('Delete failed'));

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={failingMock} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /type delete to confirm/i }),
            'DELETE',
        );
        await user.click(
            screen.getByRole('checkbox', {
                name: /i understand.*personal data/i,
            }),
        );
        await user.click(
            screen.getByRole('button', { name: 'Delete my data' }),
        );

        const errorNotification = await screen.findByRole('alert');
        expect(errorNotification).toBeInTheDocument();
        expect(errorNotification.textContent ?? '').toContain('Delete failed');

        consoleErrorSpy.mockRestore();
    });

    it('shows the generic fallback message when a non-Error value is thrown', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        const failingMock: DeletePlayerProxy = vi
            .fn()
            .mockRejectedValueOnce('plain string error');

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={failingMock} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /type delete to confirm/i }),
            'DELETE',
        );
        await user.click(
            screen.getByRole('checkbox', {
                name: /i understand.*personal data/i,
            }),
        );
        await user.click(
            screen.getByRole('button', { name: 'Delete my data' }),
        );

        const errorNotification = await screen.findByRole('alert');
        expect(errorNotification.textContent ?? '').toContain(
            'Unable to delete your account data.',
        );

        consoleErrorSpy.mockRestore();
    });

    it('dismisses the error notification when its close button is clicked', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        const failingMock: DeletePlayerProxy = vi
            .fn()
            .mockRejectedValueOnce(new Error('Delete failed'));

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={failingMock} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /type delete to confirm/i }),
            'DELETE',
        );
        await user.click(
            screen.getByRole('checkbox', {
                name: /i understand.*personal data/i,
            }),
        );
        await user.click(
            screen.getByRole('button', { name: 'Delete my data' }),
        );

        const notification = await screen.findByRole('alert');
        const closeButton = within(notification).getByRole('button');
        await user.click(closeButton);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });
});
