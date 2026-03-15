import { Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TableQualified } from '@/components/TableQualified/TableQualified';
import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

import Loading from './loading';

const meta = {
    title: 'Loading/TablePage',
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
                <TableQualified
                    table="points"
                    title="Football Peace Prize Standings"
                    year={2025}
                    records={defaultPlayerRecordDataList}
                />
            </Stack>
        </Group>
    ),
};
