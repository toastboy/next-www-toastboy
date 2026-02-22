import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultBalanceSummary } from '@/tests/mocks/data/money';
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
                playerBalances={defaultBalanceSummary.players}
                clubBalance={defaultBalanceSummary.club}
                total={defaultBalanceSummary.total}
                positiveTotal={defaultBalanceSummary.positiveTotal}
                negativeTotal={defaultBalanceSummary.negativeTotal}
                payDebt={payDebt}
            />
        </Wrapper>,
    );
};

describe('MoneyForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useRouter).mockReturnValue({
            push: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: refreshMock,
            replace: vi.fn(),
            prefetch: vi.fn(),
        } as AppRouterInstance);
    });

    it('renders player balances and summary totals', () => {
        renderForm(vi.fn<PayDebtProxy>());

        expect(screen.getByRole('heading', { name: 'Money Balances' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Player Balances' })).toBeInTheDocument();
        expect(screen.getByText('Net total: -£12.75')).toBeInTheDocument();
        expect(screen.getByText('Alex Current')).toBeInTheDocument();
        expect(screen.getByText('Jamie Historic')).toBeInTheDocument();
        expect(screen.getByText('Club Balance')).toBeInTheDocument();
    });

    it('hides zero-balance players by default and shows them when toggled on', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <MoneyForm
                    playerBalances={[
                        {
                            playerId: 11,
                            playerName: 'Alex Current',
                            amount: 750,
                        },
                        {
                            playerId: 13,
                            playerName: 'Casey Zero',
                            amount: 0,
                        },
                    ]}
                    clubBalance={{
                        playerId: null,
                        playerName: 'Club',
                        amount: -500,
                    }}
                    total={250}
                    positiveTotal={750}
                    negativeTotal={-500}
                    payDebt={vi.fn<PayDebtProxy>()}
                />
            </Wrapper>,
        );

        expect(screen.queryByText('Casey Zero')).not.toBeInTheDocument();

        await user.click(screen.getByRole('switch', { name: 'Show players with zero balance' }));

        expect(screen.getByText('Casey Zero')).toBeInTheDocument();
    });

    it('renders empty state when there are no balances', () => {
        render(
            <Wrapper>
                <MoneyForm
                    playerBalances={[]}
                    clubBalance={{
                        playerId: null,
                        playerName: 'Club',
                        amount: 0,
                    }}
                    total={0}
                    positiveTotal={0}
                    negativeTotal={0}
                    payDebt={vi.fn<PayDebtProxy>()}
                />
            </Wrapper>,
        );

        expect(screen.getByText('No balances recorded yet')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Paid' })).not.toBeInTheDocument();
    });

    it('submits a payment, updates notifications, and refreshes', async () => {
        const user = userEvent.setup();
        const payDebt = vi.fn<PayDebtProxy>().mockResolvedValue({
            playerId: 11,
            transactionId: 777,
            amount: 750,
            resultingBalance: 0,
        });

        renderForm(payDebt);

        await user.click(screen.getAllByRole('button', { name: 'Paid' })[0]);

        await waitFor(() => {
            expect(payDebt).toHaveBeenCalledWith({
                playerId: 11,
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
                },
            }),
        );
        expect(captureUnexpectedErrorMock).toHaveBeenCalledTimes(1);

        expect(refreshMock).not.toHaveBeenCalled();
    });
});
