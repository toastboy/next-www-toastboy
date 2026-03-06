import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

import { PlayerResults } from './PlayerResults';

const meta = {
    title: 'Player/PlayerResults',
    component: PlayerResults,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: defaultPlayer,
        year: 2023,
        record: defaultPlayerRecord,
    },
};
