import { Group, Paper, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Turnout } from '@/components/Turnout/Turnout';
import { defaultTurnoutByYearList } from '@/tests/mocks/data/turnoutByYear';

import Loading from './loading';

const meta = {
    title: 'Loading/TurnoutPage',
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
                <Paper shadow="xl" p="xl">
                    <Turnout turnout={defaultTurnoutByYearList} />
                </Paper>
            </Stack>
        </Group>
    ),
};
