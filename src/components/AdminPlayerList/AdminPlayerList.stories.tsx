import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { SendMailOptions } from 'nodemailer';

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
        onSendEmail: async (mailOptions: SendMailOptions) => {
            const htmlContent = typeof mailOptions.html === 'string' ?
                mailOptions.html :
                '[non-string content]';
            const toAddress = typeof mailOptions.to === 'string' ? mailOptions.to : JSON.stringify(mailOptions.to);
            const ccAddress = typeof mailOptions.cc === 'string' ? mailOptions.cc : JSON.stringify(mailOptions.cc ?? '');
            console.log(`Sending email to ${toAddress}, cc ${ccAddress} with subject "${mailOptions.subject ?? ''}": ${htmlContent}`);
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
