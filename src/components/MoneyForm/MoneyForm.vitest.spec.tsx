import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultDebtsSummary } from '@/tests/mocks/data/money';
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
