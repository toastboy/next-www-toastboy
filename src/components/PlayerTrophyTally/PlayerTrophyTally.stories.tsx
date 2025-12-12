import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerRecord } from '@/tests/mocks';

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
