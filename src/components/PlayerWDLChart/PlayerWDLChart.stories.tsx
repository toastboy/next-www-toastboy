import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerWDLChart } from './PlayerWDLChart';

const samplePlayer = {
    id: 2,
    name: 'Frank Forward',
    anonymous: false,
    joined: new Date('2019-08-12'),
    finished: null,
    born: 1988,
    comment: null,
    introducedBy: 1,
    accountEmail: 'frank@example.com',
    extraEmails: [
        { email: 'frank+cc@example.com', verified: true },
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
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerWDLChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: samplePlayer,
    },
};
