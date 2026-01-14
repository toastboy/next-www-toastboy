import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerFormList } from '@/tests/mocks';

import { PlayerLastPlayed } from './PlayerLastPlayed';

const meta = {
    title: 'Player/PlayerLastPlayed',
    component: PlayerLastPlayed,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerLastPlayed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        lastPlayed: defaultPlayerFormList[0],
    },
};
