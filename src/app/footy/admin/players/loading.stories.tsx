import { Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { defaultPlayerDataList } from '@/tests/mocks/data/playerData';

import Loading from './loading';

const samplePlayers = defaultPlayerDataList.slice(0, 8);

const meta = {
    title: 'Loading/AdminPlayersPage',
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
                <AdminPlayerList
                    players={samplePlayers}
                    userEmails={samplePlayers
                        .map((p) => p.accountEmail)
                        .filter((email): email is string => !!email)
                        .slice(0, 3)}
                    onAddPlayerInvite={async () => Promise.resolve('https://example.com/invite')}
                    onSendEmail={async () => Promise.resolve()}
                />
            </Stack>
        </Group>
    ),
};
