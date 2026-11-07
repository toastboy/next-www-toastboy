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

// A fixed date that is always in the future. Computing it from the clock
// (now + 7 days) shows a different day number every day, so Chromatic would
// report a change on every build.
const FUTURE_DATE = new Date('2099-06-20T19:00:00Z');

export const PastGame: Story = {
    args: {
        gameDay: createMockGameDay({}),
    },
};

export const PastNoGame: Story = {
    args: {
        gameDay: createMockGameDay({
            status: 'NoGame',
            mailSent: null,
        }),
    },
};

export const PastCancelled: Story = {
    args: {
        gameDay: createMockGameDay({
            status: 'NoGame',
        }),
    },
};

export const FutureGame: Story = {
    args: {
        gameDay: createMockGameDay({
            date: FUTURE_DATE,
        }),
    },
};

export const FutureNoGame: Story = {
    args: {
        gameDay: createMockGameDay({
            status: 'NoGame',
            date: FUTURE_DATE,
        }),
    },
};
