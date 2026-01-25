import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

import { PlayerTrophyTally } from './PlayerTrophyTally';

const meta = {
    title: 'Player/PlayerTrophyTally',
    component: PlayerTrophyTally,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerTrophyTally>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        table: 'averages',
        trophies: [defaultPlayerRecord],
    },
};
