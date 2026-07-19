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
        // load/error event fires. Wait on that explicit signal rather than
        // polling the CSS opacity it also drives, which is subject to
        // transition-timing noise and forces a much longer timeout.
        await waitFor(() => {
            const img = canvas.getByRole('img', { name: /gary player/i, busy: false });
            return expect(img).toBeVisible();
        }, { timeout: 6000 });
    },
};
