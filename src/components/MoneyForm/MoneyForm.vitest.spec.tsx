import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockDebtsSummary, defaultDebtsSummary } from '@/tests/mocks/data/money';
import { createMockPlayer } from '@/tests/mocks/data/player';
import type { PayDebtProxy } from '@/types/actions/PayDebt';

const { refreshMock, notificationsShowMock, notificationsUpdateMock, captureUnexpectedErrorMock } = vi.hoisted(() => ({
    refreshMock: vi.fn(),
    notificationsShowMock: vi.fn(),
    notificationsUpdateMock: vi.fn(),
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: notificationsShowMock,
        update: notificationsUpdateMock,
    },
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

const renderForm = (payDebt: PayDebtProxy) => {
    render(
        <Wrapper>
            <MoneyForm
                playerDebts={defaultDebtsSummary.players}
                payDebt={payDebt}
            />
        </Wrapper>,
    );
};

describe('MoneyForm', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.clearAllMocks();
        vi.mocked(useRouter).mockReturnValue({
            push: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: refreshMock,
            replace: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('renders unpaid player charges', () => {
        renderForm(vi.fn<PayDebtProxy>());

        expect(screen.getByRole('heading', { name: 'Unpaid Player Charges' })).toBeInTheDocument();
        expect(screen.getByText('Alex Current')).toBeInTheDocument();
        expect(screen.getByText('Jamie Historic')).toBeInTheDocument();
    });

    it('renders empty state when there are no debts', () => {
        render(
            <Wrapper>
                <MoneyForm
                    playerDebts={[]}
                    payDebt={vi.fn<PayDebtProxy>()}
                />
            </Wrapper>,
        );

        expect(screen.queryByRole('button', { name: 'Paid' })).not.toBeInTheDocument();
    });

    it('submits payment with multiple gameDayIds, updates notifications, and refreshes', async () => {
        const user = userEvent.setup();
        const payDebt = vi.fn<PayDebtProxy>().mockResolvedValue({
            playerId: 21,
            transactionIds: [777, 778],
            amount: 1225,
            resultingBalance: 0,
        });

        renderForm(payDebt);

        await user.click(screen.getAllByRole('button', { name: 'Paid' })[0]);

        await waitFor(() => {
            expect(payDebt).toHaveBeenCalledWith({
                playerId: 11,
                gameDayIds: [8, 10],
                amount: 750,
            });
        });

        expect(notificationsShowMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'money-paid-11',
            loading: true,
        }));
        expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'money-paid-11',
            color: 'teal',
            title: 'Payment recorded',
        }));
        expect(refreshMock).toHaveBeenCalledTimes(1);
    });

    it('shows singular "game" label for a player with one debt', () => {
        const singleDebt = [{
            player: { id: 99, name: 'Pat Single', accountEmail: null, anonymous: false, joined: null, finished: null, born: null, comment: null, introducedBy: null },
            debts: [{ gameDay: createMockGameDay({ id: 5, year: 2024, date: new Date('2024-01-09'), cost: 400 }), amount: 400 }],
        }];

        render(
            <Wrapper>
                <MoneyForm playerDebts={singleDebt} payDebt={vi.fn<PayDebtProxy>()} />
            </Wrapper>,
        );

        expect(screen.getByText(/1 game\b/)).toBeInTheDocument();
    });

    it('disables Pay button when all debt checkboxes are unchecked', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<PayDebtProxy>());

        // Uncheck the first debt checkbox for Alex Current (gameDay 8)
        const checkboxes = screen.getAllByRole('checkbox');
        // Alex Current has 2 debts; uncheck both
        await user.click(checkboxes[0]);
        await user.click(checkboxes[1]);

        // The first Paid button should now be disabled (no items checked)
        expect(screen.getAllByRole('button', { name: 'Paid' })[0]).toBeDisabled();
    });

    it('re-enables Pay button after unchecking then re-checking a debt', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<PayDebtProxy>());

        const checkboxes = screen.getAllByRole('checkbox');
        // Uncheck the first debt for Alex Current
        await user.click(checkboxes[0]);
        // Re-check it — this takes the "add to list" branch in toggleDebt
        await user.click(checkboxes[0]);

        // Both debts are checked again so Pay is enabled
        expect(screen.getAllByRole('button', { name: 'Paid' })[0]).not.toBeDisabled();
    });

    it('uses "player" in the loading notification when player name is null', async () => {
        const user = userEvent.setup();
        const payDebt = vi.fn<PayDebtProxy>().mockResolvedValue({ playerId: 50, transactionIds: [1], amount: 300, resultingBalance: 0 });
        const nullNameDebts = createMockDebtsSummary({
            players: [{
                player: createMockPlayer({ id: 50, name: null as unknown as string }),
                debts: [{ gameDay: createMockGameDay({ id: 9 }), amount: 300 }],
            }],
        });

        render(
            <Wrapper>
                <MoneyForm playerDebts={nullNameDebts.players} payDebt={payDebt} />
            </Wrapper>,
        );

        await user.click(screen.getAllByRole('button', { name: 'Paid' })[0]);

        await waitFor(() => {
            const calls: { message?: string }[] = notificationsShowMock.mock.calls.map((c: unknown[]) => c[0] as { message?: string });
            expect(calls.some((c) => c.message?.includes('for player across'))).toBe(true);
        });
    });

    it('shows generic error message when payment fails with a non-Error value', async () => {
        const user = userEvent.setup();
        const payDebt = vi.fn<PayDebtProxy>().mockRejectedValue('plain string');

        renderForm(payDebt);

        await user.click(screen.getAllByRole('button', { name: 'Paid' })[0]);

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
                id: 'money-paid-11',
                color: 'red',
                message: 'Failed to record payment',
            }));
        });
    });

    it('shows error notification and does not refresh when payment fails', async () => {
        const user = userEvent.setup();
        const payDebt = vi.fn<PayDebtProxy>().mockRejectedValue(new Error('Boom'));

        renderForm(payDebt);

        await user.click(screen.getAllByRole('button', { name: 'Paid' })[0]);

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
                id: 'money-paid-11',
                color: 'red',
                message: 'Boom',
            }));
        });
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                layer: 'client',
                component: 'MoneyForm',
                action: 'payDebt',
                route: '/footy/admin/money',
                extra: {
                    playerId: 11,
                    amount: 750,
                    gameDayCount: 2,
                },
            }),
        );
        expect(captureUnexpectedErrorMock).toHaveBeenCalledTimes(1);

        expect(refreshMock).not.toHaveBeenCalled();
    });
});
