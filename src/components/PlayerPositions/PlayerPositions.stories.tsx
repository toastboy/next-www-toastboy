import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

import { PlayerPositions } from './PlayerPositions';

const meta = {
    title: 'Player/PlayerPositions',
    component: PlayerPositions,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerPositions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: defaultPlayer,
        year: 2023,
        record: defaultPlayerRecord,
    },
};
