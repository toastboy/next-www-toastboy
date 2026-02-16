import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultDebtSummary } from '@/tests/mocks/data/money';
import type { PayDebtProxy } from '@/types/actions/PayDebt';

const { refreshMock, notificationsShowMock, notificationsUpdateMock } = vi.hoisted(() => ({
    refreshMock: vi.fn(),
    notificationsShowMock: vi.fn(),
    notificationsUpdateMock: vi.fn(),
}));

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: notificationsShowMock,
        update: notificationsUpdateMock,
    },
}));

const renderForm = (payDebt: PayDebtProxy) => {
    render(
        <Wrapper>
            <MoneyForm
                currentDebts={defaultDebtSummary.current}
                historicDebts={defaultDebtSummary.historic}
                total={defaultDebtSummary.total}
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

    it('renders current and historic debt rows with total', () => {
        renderForm(vi.fn<PayDebtProxy>());

        expect(screen.getByRole('heading', { name: 'Subs Not Paid' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Current Debts' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Historic Debts' })).toBeInTheDocument();
        expect(screen.getByText('Total: £24.75')).toBeInTheDocument();
        expect(screen.getByText('Alex Current')).toBeInTheDocument();
        expect(screen.getByText('Jamie Historic')).toBeInTheDocument();
    });

    it('renders empty state when nobody owes money', () => {
        render(
            <Wrapper>
                <MoneyForm
                    currentDebts={[]}
                    historicDebts={[]}
                    total={0}
                    payDebt={vi.fn<PayDebtProxy>()}
                />
            </Wrapper>,
        );

        expect(screen.getByText('Stone me! Nobody owes money')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Paid' })).not.toBeInTheDocument();
    });

    it('submits a payment, updates notifications, and refreshes', async () => {
        const user = userEvent.setup();
        const payDebt = vi.fn<PayDebtProxy>().mockResolvedValue({
            playerId: 11,
            gamesMarkedPaid: 1,
            requestedAmount: 7.5,
            appliedAmount: 7.5,
            remainingAmount: 0,
        });

        renderForm(payDebt);

        await user.click(screen.getAllByRole('button', { name: 'Paid' })[0]);

        await waitFor(() => {
            expect(payDebt).toHaveBeenCalledWith({
                playerId: 11,
                amount: 7.5,
            });
        });

        expect(notificationsShowMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'money-paid-11',
            loading: true,
        }));
        expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'money-paid-11',
            color: 'teal',
        }));
        expect(refreshMock).toHaveBeenCalledTimes(1);
    });

    it('shows warning notification when no games are marked paid', async () => {
        const user = userEvent.setup();
        const payDebt = vi.fn<PayDebtProxy>().mockResolvedValue({
            playerId: 11,
            gamesMarkedPaid: 0,
            requestedAmount: 7.5,
            appliedAmount: 0,
            remainingAmount: 7.5,
        });

        renderForm(payDebt);

        await user.click(screen.getAllByRole('button', { name: 'Paid' })[0]);

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
                id: 'money-paid-11',
                color: 'yellow',
            }));
        });

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

        expect(refreshMock).not.toHaveBeenCalled();
    });
});
