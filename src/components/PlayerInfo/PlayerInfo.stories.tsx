import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { createMockPlayer, defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerEmailData } from '@/tests/mocks/data/playerData';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';

import { PlayerInfo } from './PlayerInfo';

const introducedBy = createMockPlayer({ id: 2, name: 'Introducer' });

const meta = {
    title: 'Player/PlayerInfo',
    component: PlayerInfo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        player: defaultPlayer,
        year: 2023,
        lastPlayed: defaultPlayerFormList[9],
        lastWon: defaultPlayerFormList[0],
    },
} satisfies Meta<typeof PlayerInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Full: Story = {
    args: {
        introducedBy,
        isAuthenticated: true,
        isAdmin: true,
        playerData: defaultPlayerEmailData,
        onSendEmail: async (mailOptions) => {
            console.log(`Sending email with subject "${mailOptions.subject ?? ''}"`);
            return Promise.resolve();
        },
    },
};

export const NoJoinDate: Story = {
    args: {
        player: createMockPlayer({ joined: null }),
    },
};
