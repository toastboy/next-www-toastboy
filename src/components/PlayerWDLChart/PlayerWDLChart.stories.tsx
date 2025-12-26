import type { Meta, StoryObj } from '@storybook/nextjs';

import { PlayerWDLChart } from './PlayerWDLChart';

const samplePlayer = {
    id: 2,
    isAdmin: false,
    name: 'Frank Forward',
    anonymous: false,
    joined: new Date('2019-08-12'),
    finished: null,
    born: new Date('1988-03-10'),
    comment: null,
    introducedBy: 1,
    emails: [
        {
            id: 1,
            playerId: 2,
            email: 'frank@example.com',
            verifiedAt: new Date('2019-08-12'),
            createdAt: new Date('2019-08-12'),
        },
    ],
    firstResponded: 1,
    lastResponded: 30,
    firstPlayed: 2,
    lastPlayed: 28,
    gamesPlayed: 30,
    gamesWon: 14,
    gamesDrawn: 6,
    gamesLost: 10,
};

const meta = {
    title: 'Player/PlayerWDLChart',
    component: PlayerWDLChart,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerWDLChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: samplePlayer,
    },
};
