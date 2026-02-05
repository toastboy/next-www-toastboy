
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { DeleteAccountForm } from '@/components/DeleteAccountForm/DeleteAccountForm';
import { Wrapper } from '@/tests/components/lib/common';
import { DeletePlayerProxy } from '@/types/actions/DeletePlayer';

describe('DeleteAccountForm', () => {
    const mockDeletePlayer: DeletePlayerProxy = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the confirmation fields and submit button', () => {
        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={mockDeletePlayer} />
            </Wrapper>,
        );

        expect(screen.getByTestId('confirm-phrase-input')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-pii-checkbox')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('validates required confirmation inputs', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={mockDeletePlayer} />
            </Wrapper>,
        );

        await user.click(screen.getByTestId('submit-button'));

        const confirmPhraseInput = screen.getByTestId('confirm-phrase-input');
        const confirmPhraseErrorId = confirmPhraseInput.getAttribute('aria-describedby');
        expect(confirmPhraseErrorId).toBeTruthy();

        const confirmPhraseError = confirmPhraseErrorId ?
            document.getElementById(confirmPhraseErrorId) :
            null;
        expect(confirmPhraseError).toBeTruthy();
        expect(confirmPhraseError?.textContent ?? '').toBe('Type DELETE to confirm');

        const confirmPiiInput = screen.getByTestId('confirm-pii-checkbox');
        const confirmPiiRoot = confirmPiiInput.closest('.mantine-Checkbox-root');
        expect(confirmPiiRoot).toBeTruthy();
        expect(confirmPiiRoot?.textContent ?? '').toContain('Please confirm deletion of your personal data');
    });

    it('submits the form and shows a success message', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={mockDeletePlayer} />
            </Wrapper>,
        );

        await user.type(screen.getByTestId('confirm-phrase-input'), 'DELETE');
        await user.click(screen.getByTestId('confirm-pii-checkbox'));
        await user.click(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(mockDeletePlayer).toHaveBeenCalledTimes(1);
        });

        expect(await screen.findByTestId('success-notification')).toBeInTheDocument();
    });

    it('shows an error message when deletion fails', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const failingMock: DeletePlayerProxy = vi.fn().mockRejectedValueOnce(new Error('Delete failed'));

        render(
            <Wrapper>
                <DeleteAccountForm onDeletePlayer={failingMock} />
            </Wrapper>,
        );

        await user.type(screen.getByTestId('confirm-phrase-input'), 'DELETE');
        await user.click(screen.getByTestId('confirm-pii-checkbox'));
        await user.click(screen.getByTestId('submit-button'));

        const errorNotification = await screen.findByTestId('error-notification');
        expect(errorNotification).toBeInTheDocument();
        expect(errorNotification.textContent ?? '').toContain('Delete failed');

        consoleErrorSpy.mockRestore();
    });
});
