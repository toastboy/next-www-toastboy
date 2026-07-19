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
        // Each PlayerMugshot's <img>, across both teams, is aria-busy until
        // ImageWithPlaceholder's load/error handler fires. Wait on that
        // explicit signal for every image rather than polling the CSS
        // opacity it also drives, which is subject to transition-timing
        // noise and forces a much longer timeout.
        const total = (await canvas.findAllByRole('img', { name: /gary player/i })).length;
        await waitFor(() => {
            const ready = canvas.getAllByRole('img', { name: /gary player/i, busy: false });
            return expect(ready).toHaveLength(total);
        }, { timeout: 6000 });
    },
};
