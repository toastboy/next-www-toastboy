import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { expect, waitFor } from 'storybook/test';

import { defaultGameDay } from '@/tests/mocks/data/gameDay';
import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

import { GameDaySummary } from './GameDaySummary';

const meta = {
    title: 'GameDay/GameDaySummary',
    component: GameDaySummary,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
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
        isAdmin: false,
        setGameResult: async () => Promise.resolve({} as GameDayType),
    },
    play: async ({ canvas }) => {
        // Each PlayerMugshot's <img>, across both teams, is aria-busy until
        // ImageWithPlaceholder's load/error handler fires — wait on that
        // explicit signal for every image rather than the CSS opacity it
        // also drives, which depends on transition timing and
        // getComputedStyle semantics. The 10s budget isn't about that
        // ambiguity though: it's real headroom for when the whole Storybook
        // suite runs and dozens of images across other stories are decoding
        // under CPU contention at the same time (see testTimeout in
        // vitest.config.ts, which must exceed this).
        const total = (
            await canvas.findAllByRole('img', { name: /gary player/i })
        ).length;
        await waitFor(
            () => {
                const ready = canvas.getAllByRole('img', {
                    name: /gary player/i,
                    busy: false,
                });
                return expect(ready).toHaveLength(total);
            },
            { timeout: 10000 },
        );
    },
};

export const AdminControls: Story = {
    args: {
        ...Primary.args,
        isAdmin: true,
    },
    play: async ({ canvas }) => {
        await canvas.findByRole('button', { name: 'Save' });
    },
};
