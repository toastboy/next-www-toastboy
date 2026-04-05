import { Flex, Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
import { defaultGameDay } from '@/tests/mocks/data/gameDay';
import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

import Loading from './loading';

const meta = {
    title: 'Loading/GamePage',
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
                <Flex w="100%" direction="column" gap="md">
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        teamA={defaultTeamPlayerList}
                        teamB={defaultTeamPlayerList}
                    />
                </Flex>
            </Stack>
        </Group>
    ),
};
