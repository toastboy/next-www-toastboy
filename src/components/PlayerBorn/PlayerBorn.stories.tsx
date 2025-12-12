import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayer } from '@/tests/mocks';

import { PlayerBorn } from './PlayerBorn';

const meta = {
    title: 'Player/PlayerBorn',
    component: PlayerBorn,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerBorn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: defaultPlayer,
    },
};
