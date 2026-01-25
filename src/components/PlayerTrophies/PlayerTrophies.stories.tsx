import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

import { PlayerTrophies } from './PlayerTrophies';

const meta = {
    title: 'Player/PlayerTrophies',
    component: PlayerTrophies,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerTrophies>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        trophies: defaultTrophiesList,
    },
};
