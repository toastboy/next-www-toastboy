import { Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AdminUserList } from '@/components/AdminUserList/AdminUserList';
import { defaultAdminUserDataPayload } from '@/tests/mocks/data/adminUserData';

import Loading from './loading';

const sampleUsers = [
    defaultAdminUserDataPayload,
    {
        ...defaultAdminUserDataPayload,
        id: 'user_2',
        name: 'Victoria Veteran',
        email: 'victoria.veteran@example.com',
        role: 'user',
        createdAt: '2024-02-14T10:30:00.000Z',
        updatedAt: '2024-06-21T12:30:00.000Z',
    },
];

const meta = {
    title: 'Loading/AdminUsersPage',
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
                <AdminUserList
                    users={sampleUsers}
                    setAdminRole={async () => Promise.resolve()}
                />
            </Stack>
        </Group>
    ),
};
