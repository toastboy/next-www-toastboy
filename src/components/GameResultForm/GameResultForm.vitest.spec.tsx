import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { vi } from 'vitest';

import { GameResultForm } from '@/components/GameResultForm/GameResultForm';
import { Wrapper } from '@/tests/components/lib/common';
import type { SetGameResultProxy } from '@/types/actions/SetGameResult';

const { refreshMock, notificationsShowMock, notificationsUpdateMock } = vi.hoisted(() => ({
    refreshMock: vi.fn(),
    notificationsShowMock: vi.fn(),
    notificationsUpdateMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: refreshMock,
    }),
}));

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: notificationsShowMock,
        update: notificationsUpdateMock,
    },
}));

const renderForm = (setGameResult: SetGameResultProxy) => {
    render(
        <Wrapper>
            <GameResultForm
                gameDayId={1249}
                bibs={null}
                winners={null}
                setGameResult={setGameResult}
            />
        </Wrapper>,
    );
};

describe('GameResultForm', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('renders with Save disabled when nothing changed', () => {
        renderForm(vi.fn<SetGameResultProxy>());

        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('saves bibs and refreshes the page after success', async () => {
        const user = userEvent.setup();
        const setGameResult = vi.fn<SetGameResultProxy>().mockResolvedValue({} as GameDayType);

        renderForm(setGameResult);

        await user.click(screen.getByRole('combobox', { name: 'Bibs' }));
        await user.click(await screen.findByRole('option', { name: 'Team A wore bibs', hidden: true }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(setGameResult).toHaveBeenCalledWith({
                gameDayId: 1249,
                bibs: 'A',
                winner: null,
            });
        });

        expect(refreshMock).toHaveBeenCalledTimes(1);
        expect(notificationsShowMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'game-result-update',
            loading: true,
        }));
        expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'game-result-update',
            color: 'teal',
        }));
    });

    it('re-enables Save after a successful save when the value is changed back to the original', async () => {
        const user = userEvent.setup();
        const setGameResult = vi.fn<SetGameResultProxy>().mockResolvedValue({} as GameDayType);

        renderForm(setGameResult);

        // Change winner to A and save.
        await user.click(screen.getByRole('combobox', { name: 'Result' }));
        await user.click(await screen.findByRole('option', { name: 'Team A won', hidden: true }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(setGameResult).toHaveBeenCalledTimes(1);
        });

        // Button should be disabled again — no unsaved changes.
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

        // Change winner back to 'none'. Both Selects render "Not set" in their
        // portals; scope the option lookup to the Result combobox's own listbox
        // via its aria-controls attribute to avoid ambiguity.
        const resultCombobox = screen.getByRole('combobox', { name: 'Result' });
        await user.click(resultCombobox);
        const resultListboxId = resultCombobox.getAttribute('aria-controls');
        const resultListbox = document.getElementById(resultListboxId!);
        await user.click(within(resultListbox!).getByRole('option', { name: 'Not set', hidden: true }));

        // The form is now dirty relative to the saved state (A), so Save must
        // be enabled. Before the fix this would remain disabled because
        // isDirty() was still comparing against the original initialValues.
        expect(screen.getByRole('button', { name: 'Save' })).not.toBeDisabled();
    });

    it('shows a generic error message when save fails with a non-Error value', async () => {
        const user = userEvent.setup();
        const setGameResult = vi.fn<SetGameResultProxy>().mockRejectedValue('string error');

        renderForm(setGameResult);

        await user.click(screen.getByRole('combobox', { name: 'Result' }));
        await user.click(await screen.findByRole('option', { name: 'Draw', hidden: true }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
                id: 'game-result-update',
                color: 'red',
                message: 'Failed to update game',
            }));
        });
    });

    it('shows an error notification when save fails', async () => {
        const user = userEvent.setup();
        const setGameResult = vi.fn<SetGameResultProxy>().mockRejectedValue(new Error('Boom'));

        renderForm(setGameResult);

        await user.click(screen.getByRole('combobox', { name: 'Result' }));
        await user.click(await screen.findByRole('option', { name: 'Draw', hidden: true }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
                id: 'game-result-update',
                color: 'red',
                message: 'Boom',
            }));
        });

        expect(refreshMock).not.toHaveBeenCalled();
    });
});
