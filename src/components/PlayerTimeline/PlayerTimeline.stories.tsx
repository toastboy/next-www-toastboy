import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerTimeline } from './PlayerTimeline';

const samplePlayer = {
    id: 1,
    name: 'Jane Doe',
    anonymous: false,
    joined: new Date('2020-01-01'),
    finished: null,
    born: 1990,
    comment: null,
    introducedBy: 2,
    accountEmail: 'jane@example.com',
    extraEmails: [
        { email: 'jane+cc@example.com', verified: true },
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
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
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
