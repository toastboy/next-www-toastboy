import { Container, Group, Stack, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import { defaultDebtsSummary } from '@/tests/mocks/data/money';
import type { PayDebtProxy, PayDebtResult } from '@/types/actions/PayDebt';

import Loading from './loading';

const meta = {
    title: 'Loading/MoneyPage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

const payDebt: PayDebtProxy = async ({ playerId, amount, gameDayIds }) =>
    Promise.resolve({
        playerId,
        transactionIds: gameDayIds.map((_, i) => 100 + i),
        amount,
        resultingBalance: 0,
    } satisfies PayDebtResult);

export const Skeleton: Story = {};

export const Comparison: Story = {
    render: () => (
        <Group align="flex-start" gap="xl" wrap="nowrap">
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loading</Text>
                <Loading />
            </Stack>
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loaded</Text>
                <Notifications />
                <Container size="lg" py="lg">
                    <MoneyForm
                        playerDebts={defaultDebtsSummary.players}
                        payDebt={payDebt}
                    />
                </Container>
            </Stack>
        </Group>
    ),
};
