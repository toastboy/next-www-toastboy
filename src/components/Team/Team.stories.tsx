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
        // Every player's mugshot stays at opacity 0 behind a Skeleton until
        // ImageWithPlaceholder's load/error handler fires, so wait for that
        // rather than asserting immediately.
        const imgs = await canvas.findAllByRole('img', { name: /gary player/i });
        await waitFor(() => imgs.forEach((img) => expect(img).toBeVisible()), { timeout: 5000 });
    },
};
