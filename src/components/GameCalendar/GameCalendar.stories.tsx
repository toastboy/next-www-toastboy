import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';

import { defaultGameDayList } from '@/tests/mocks/data/gameDay';

import { GameCalendar } from './GameCalendar';

const meta = {
    title: 'Games/GameCalendar',
    component: GameCalendar,
    tags: ['autodocs'],
    parameters: {
        msw: {
            handlers: [
                http.get('*/api/footy/gameday', () => HttpResponse.json(defaultGameDayList)),
            ],
        },
    },
} satisfies Meta<typeof GameCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        date: new Date('2024-03-10'),
    },
};
