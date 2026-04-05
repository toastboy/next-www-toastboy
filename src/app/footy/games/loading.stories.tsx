import { Flex, Group, Stack, Text, Title } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameDayList } from '@/components/GameDayList/GameDayList';
import { defaultGameDayList } from '@/tests/mocks/data/gameDay';

import Loading from './loading';

const meta = {
    title: 'Loading/GamesPage',
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
                <Flex direction="column" align="center" gap="lg">
                    <Title order={1}>2021 Games</Title>
                    <Title order={2}>10 played, 2 cancelled</Title>
                    <GameDayList gameDays={defaultGameDayList.slice(0, 12)} year={2021} />
                </Flex>
            </Stack>
        </Group>
    ),
};
