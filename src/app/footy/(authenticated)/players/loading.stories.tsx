import { Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerList } from '@/components/PlayerList/PlayerList';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';

import Loading from './loading';

const meta = {
    title: 'Loading/PlayersPage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePlayers = [
    createMockPlayerData({ id: 1, name: 'Alice Active', finished: null, lastResponded: 20 }),
    createMockPlayerData({ id: 2, name: 'Bob Former', finished: new Date('2020-01-01'), lastResponded: 20 }),
    createMockPlayerData({ id: 3, name: 'Charlie Active', finished: null, lastResponded: 19 }),
];

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
                <PlayerList
                    players={samplePlayers}
                    gameDay={createMockGameDay({ id: 20 })}
                    sendEmail={async () => Promise.resolve()}
                />
            </Stack>
        </Group>
    ),
};
