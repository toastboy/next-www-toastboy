import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerDataList } from '@/tests/mocks/data/playerData';

import { AdminPlayerList } from './AdminPlayerList';

const samplePlayers = defaultPlayerDataList.slice(0, 8);

const meta = {
    title: 'Admin/AdminPlayerList',
    component: AdminPlayerList,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminPlayerList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        players: samplePlayers,
        userEmails: samplePlayers
            .map((player) => player.accountEmail)
            .filter((email): email is string => !!email)
            .slice(0, 3),
    },
};

export const Empty: Story = {
    args: {
        players: [],
    },
};
