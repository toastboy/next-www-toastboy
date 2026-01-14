import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultGameDay } from '@/tests/mocks';
import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

import { GameDaySummary } from './GameDaySummary';

const meta = {
    title: 'GameDay/GameDaySummary',
    component: GameDaySummary,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GameDaySummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        gameDay: defaultGameDay,
        teamA: defaultTeamPlayerList,
        teamB: defaultTeamPlayerList,
    },
};
