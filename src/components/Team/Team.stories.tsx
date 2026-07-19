import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';

import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

import { Team } from './Team';

const meta = {
    title: 'Player/Team',
    component: Team,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Team>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        teamName: 'B',
        team: defaultTeamPlayerList,
        maxTeamSize: defaultTeamPlayerList.length,
    },
    play: async ({ canvas }) => {
        // Each PlayerMugshot's <img> is aria-busy until ImageWithPlaceholder's
        // load/error handler fires — wait on that explicit signal for every
        // image rather than the CSS opacity it also drives, which depends on
        // transition timing and getComputedStyle semantics. The 10s budget
        // isn't about that ambiguity though: it's real headroom for when the
        // whole Storybook suite runs and dozens of images across other
        // stories are decoding under CPU contention at the same time (see
        // testTimeout in vitest.config.ts, which must exceed this).
        const total = (await canvas.findAllByRole('img', { name: /gary player/i })).length;
        await waitFor(() => {
            const ready = canvas.getAllByRole('img', { name: /gary player/i, busy: false });
            return expect(ready).toHaveLength(total);
        }, { timeout: 10000 });
    },
};
