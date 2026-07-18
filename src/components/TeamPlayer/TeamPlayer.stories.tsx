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
        // Mugshot image should render for the player. It stays at opacity 0
        // behind a Skeleton until ImageWithPlaceholder's load/error handler
        // fires, so wait for that rather than asserting immediately.
        const img = await canvas.findByRole('img', { name: /gary player/i });
        await waitFor(() => expect(img).toBeVisible(), { timeout: 5000 });
    },
};
