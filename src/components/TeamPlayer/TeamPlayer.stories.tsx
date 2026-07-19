import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';

import { defaultTeamPlayer } from '@/tests/mocks/data/teamPlayer';

import { TeamPlayer } from './TeamPlayer';

const meta = {
    title: 'Player/TeamPlayer',
    component: TeamPlayer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TeamPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        teamPlayer: defaultTeamPlayer,
    },
    play: async ({ canvas }) => {
        // ImageWithPlaceholder marks its <img> aria-busy until the real
        // load/error event fires — wait on that explicit signal rather than
        // the CSS opacity it also drives, which depends on transition timing
        // and getComputedStyle semantics. The 10s budget isn't about that
        // ambiguity though: it's real headroom for when the whole Storybook
        // suite runs and dozens of images across other stories are decoding
        // under CPU contention at the same time (see testTimeout in
        // vitest.config.ts, which must exceed this).
        await waitFor(() => {
            const img = canvas.getByRole('img', { name: /gary player/i, busy: false });
            return expect(img).toBeVisible();
        }, { timeout: 10000 });
    },
};
