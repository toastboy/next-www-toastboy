import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultBalanceSummary } from '@/tests/mocks/data/money';
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
        transactionId: 101,
        amount,
        resultingBalance: 0,
    } satisfies PayDebtResult);

export const WithBalances: Story = {
    args: {
        playerBalances: defaultBalanceSummary.players,
        clubBalance: defaultBalanceSummary.club,
        total: defaultBalanceSummary.total,
        positiveTotal: defaultBalanceSummary.positiveTotal,
        negativeTotal: defaultBalanceSummary.negativeTotal,
        payDebt,
    },
};

export const EmptyLedger: Story = {
    args: {
        playerBalances: [],
        clubBalance: {
            playerId: null,
            playerName: 'Club',
            amount: 0,
        },
        total: 0,
        positiveTotal: 0,
        negativeTotal: 0,
        payDebt,
    },
};
