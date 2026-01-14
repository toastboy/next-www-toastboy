import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultGameDay } from '@/tests/mocks';

import { GameDayLink } from './GameDayLink';

const meta = {
    title: 'GameDay/GameDayLink',
    component: GameDayLink,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GameDayLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        gameDay: defaultGameDay,
    },
};
