import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultDebtsSummary } from '@/tests/mocks/data/money';
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

const payDebt: PayDebtProxy = async ({ playerId, amount, gameDayIds }) =>
    Promise.resolve({
        playerId,
        transactionIds: gameDayIds.map((_, i) => 100 + i),
        amount,
        resultingBalance: 0,
    } satisfies PayDebtResult);

export const WithDebts: Story = {
    args: {
        playerDebts: defaultDebtsSummary.players,
        total: defaultDebtsSummary.total,
        positiveTotal: defaultDebtsSummary.positiveTotal,
        negativeTotal: defaultDebtsSummary.negativeTotal,
        payDebt,
    },
};

export const EmptyLedger: Story = {
    args: {
        playerDebts: [],
        total: 0,
        positiveTotal: 0,
        negativeTotal: 0,
        payDebt,
    },
};
