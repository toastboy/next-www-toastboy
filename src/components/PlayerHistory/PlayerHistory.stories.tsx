import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

import { PlayerHistory } from './PlayerHistory';

const meta = {
    title: 'Player/PlayerHistory',
    component: PlayerHistory,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: defaultPlayer,
        activeYears: [2020, 2021, 2022, 2023],
        year: 2023,
        record: defaultPlayerRecord,
    },
};
