import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultDebtSummary } from '@/tests/mocks/data/money';
import type { PayDebtProxy, PayDebtResult } from '@/types/actions/PayDebt';

import { MoneyForm } from './MoneyForm';

const meta = {
    title: 'Admin/MoneyForm',
    component: MoneyForm,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MoneyForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const payDebt: PayDebtProxy = async ({ playerId, amount }) =>
    Promise.resolve({
        playerId,
        gamesMarkedPaid: 1,
        requestedAmount: amount,
        appliedAmount: amount,
        remainingAmount: 0,
    } satisfies PayDebtResult);

export const WithDebts: Story = {
    args: {
        currentDebts: defaultDebtSummary.current,
        historicDebts: defaultDebtSummary.historic,
        total: defaultDebtSummary.total,
        payDebt,
    },
};

export const AllPaid: Story = {
    args: {
        currentDebts: [],
        historicDebts: [],
        total: 0,
        payDebt,
    },
};
