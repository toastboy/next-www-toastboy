import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

import { PlayerList } from './PlayerList';

const sendEmail: SendEmailProxy = async () => Promise.resolve();

const gameDay = createMockGameDay({ id: 20 });

const samplePlayers = [
    createMockPlayerData({
        id: 1,
        name: 'Alice Active',
        accountEmail: 'alice@example.com',
        finished: null,
        lastResponded: 20,
    }),
    createMockPlayerData({
        id: 2,
        name: 'Bob Former',
        accountEmail: 'bob@example.com',
        finished: new Date('2020-01-01'),
        lastResponded: 20,
    }),
    createMockPlayerData({
        id: 3,
        name: 'Charlie Active',
        accountEmail: 'charlie@example.com',
        finished: null,
        lastResponded: 19,
    }),
];

const meta = {
    title: 'Player/PlayerList',
    component: PlayerList,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        players: samplePlayers,
        gameDay,
        sendEmail,
    },
};
