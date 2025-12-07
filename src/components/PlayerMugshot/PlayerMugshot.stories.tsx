import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayer } from '@/tests/mocks';

import PlayerMugshot from './PlayerMugshot';

const meta = {
    title: 'Player/PlayerMugshot',
    component: PlayerMugshot,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerMugshot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: defaultPlayer,
    },
};
