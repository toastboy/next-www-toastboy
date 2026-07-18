import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';

import { defaultGameDay } from '@/tests/mocks/data/gameDay';
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
        prevGameDay: null,
        nextGameDay: null,
        teamA: defaultTeamPlayerList,
        teamB: defaultTeamPlayerList,
    },
    play: async ({ canvas }) => {
        // Every player's mugshot, across both teams, stays at opacity 0
        // behind a Skeleton until ImageWithPlaceholder's load/error handler
        // fires, so wait for that rather than asserting immediately.
        const imgs = await canvas.findAllByRole('img', { name: /gary player/i });
        await waitFor(() => imgs.forEach((img) => expect(img).toBeVisible()), { timeout: 5000 });
    },
};
