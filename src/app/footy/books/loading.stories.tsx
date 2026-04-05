import { Group, Stack, Text, Title } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MoneyChart } from '@/components/MoneyChart/MoneyChart';
import { defaultMoneyChartData } from '@/tests/mocks/data/money';

import Loading from './loading';

const meta = {
    title: 'Loading/BooksPage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

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
                <Stack align="stretch" justify="center" gap="md">
                    <Title w="100%" ta="center" order={1}>2025 Books</Title>
                    <MoneyChart data={defaultMoneyChartData} />
                </Stack>
            </Stack>
        </Group>
    ),
};
