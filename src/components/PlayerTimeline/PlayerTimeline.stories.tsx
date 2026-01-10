import type { Meta, StoryObj } from '@storybook/nextjs';

import { PlayerTimeline } from './PlayerTimeline';

const samplePlayer = {
    id: 1,
    isAdmin: false,
    name: 'Jane Doe',
    anonymous: false,
    joined: new Date('2020-01-01'),
    finished: null,
    born: 1990,
    comment: null,
    introducedBy: 2,
    accountEmail: 'jane@example.com',
    extraEmails: [
        {
            id: 1,
            playerId: 1,
            email: 'jane+cc@example.com',
            verifiedAt: new Date('2020-01-01'),
            createdAt: new Date('2020-01-01'),
        },
    ],
    firstResponded: 2,
    lastResponded: 18,
    firstPlayed: 3,
    lastPlayed: 15,
    gamesPlayed: 20,
    gamesWon: 10,
    gamesDrawn: 5,
    gamesLost: 5,
};

const meta = {
    title: 'Player/PlayerTimeline',
    component: PlayerTimeline,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: samplePlayer,
        currentGameId: 25,
    },
};
