import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultTeamPlayer } from '@/tests/mocks';

import TeamPlayer from './TeamPlayer';

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
};
