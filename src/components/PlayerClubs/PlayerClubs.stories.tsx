import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';

import { PlayerClubs } from './PlayerClubs';

const meta = {
    title: 'Player/PlayerClubs',
    component: PlayerClubs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerClubs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        clubs: defaultClubSupporterDataList,
    },
};
