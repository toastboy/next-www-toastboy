import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultTeamPlayerList } from '@/tests/mocks';

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
        team: defaultTeamPlayerList,
    },
};
