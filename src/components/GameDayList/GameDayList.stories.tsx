import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultGameDayList } from '@/tests/mocks/data/gameDay';

import { GameDayList } from './GameDayList';

const meta = {
    title: 'GameDay/GameDayList',
    component: GameDayList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GameDayList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: 'fixtures',
        gameDays: defaultGameDayList.slice(0, 12),
    },
};

export const Empty: Story = {
    args: {
        title: 'results',
        gameDays: [],
    },
};
