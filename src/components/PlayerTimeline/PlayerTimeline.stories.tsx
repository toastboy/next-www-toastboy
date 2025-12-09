import type { Meta, StoryObj } from '@storybook/nextjs';

import PlayerTimeline from './PlayerTimeline';

const samplePlayer = {
    id: 1,
    login: 'jdoe',
    isAdmin: false,
    name: 'Jane Doe',
    anonymous: false,
    email: 'jane@example.com',
    joined: new Date('2020-01-01'),
    finished: null,
    born: new Date('1990-05-05'),
    comment: null,
    introducedBy: 2,
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
