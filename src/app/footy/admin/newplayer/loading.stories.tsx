import { Group, Stack, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import { defaultPlayerDataList } from '@/tests/mocks/data/playerData';
import type { CreatePlayerProxy } from '@/types/actions/CreatePlayer';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

import Loading from './loading';

const meta = {
    title: 'Loading/NewPlayerPage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

const createPlayer = fn<CreatePlayerProxy>().mockResolvedValue({
    player: { id: 1 },
    inviteLink: 'http://example.com/footy/auth/claim?token=storybook',
});

const sendEmail = fn<SendEmailProxy>().mockResolvedValue(undefined);

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
                <NewPlayerForm
                    players={defaultPlayerDataList.slice(0, 3)}
                    onCreatePlayer={createPlayer}
                    onSendEmail={sendEmail}
                />
            </Stack>
        </Group>
    ),
};
