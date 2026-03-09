import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { createMockGameDay } from '@/tests/mocks/data/gameDay';

import { GameDayIndicator } from './GameDayIndicator';

const meta = {
    title: 'GameDay/GameDayIndicator',
    component: GameDayIndicator,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GameDayIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PastGame: Story = {
    args: {
        gameDay: createMockGameDay({}),
    },
};

export const PastNoGame: Story = {
    args: {
        gameDay: createMockGameDay({
            game: false,
            mailSent: null,
        }),
    },
};

export const PastCancelled: Story = {
    args: {
        gameDay: createMockGameDay({
            game: false,
        }),
    },
};

export const FutureGame: Story = {
    args: {
        gameDay: createMockGameDay({
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }),
    },
};

export const FutureNoGame: Story = {
    args: {
        gameDay: createMockGameDay({
            game: false,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }),
    },
};
