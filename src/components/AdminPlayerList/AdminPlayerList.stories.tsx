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

export const Render: Story = {
    args: {
        players: samplePlayers,
        userEmails: samplePlayers
            .map((player) => player.accountEmail)
            .filter((email): email is string => !!email)
            .slice(0, 3),
        onAddPlayerInvite: async (playerId, email) => {
            return Promise.resolve(`https://example.com/invite/${playerId}?email=${encodeURIComponent(email)}`);
        },
        onSendEmail: async (to, cc, subject, html) => {
            console.log(`Sending email to ${to}, cc ${cc} with subject "${subject}": ${html}`);
            return Promise.resolve();
        },
    },
};

export const Empty: Story = {
    args: {
        ...Render.args,
        players: [],
    },
};
