import { Group, Stack, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MoreGamesForm } from '@/components/MoreGamesForm/MoreGamesForm';
import { defaultMoreGamesFormData } from '@/tests/mocks/data/moreGamesForm';
import type { CreateMoreGameDaysProxy } from '@/types/actions/CreateMoreGameDays';

import Loading from './loading';

const meta = {
    title: 'Loading/MoreGamesPage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCreateMoreGameDays: CreateMoreGameDaysProxy = async () => Promise.resolve([]);

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
                <MoreGamesForm
                    {...defaultMoreGamesFormData}
                    onCreateMoreGameDays={mockCreateMoreGameDays}
                />
            </Stack>
        </Group>
    ),
};
