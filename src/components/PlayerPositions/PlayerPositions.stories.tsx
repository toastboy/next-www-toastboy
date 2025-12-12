import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerRecord } from '@/tests/mocks';

import { PlayerPositions } from './PlayerPositions';

const meta = {
    title: 'Player/PlayerPositions',
    component: PlayerPositions,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerPositions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        playerName: 'Lionel Scruffy',
        year: 2023,
        record: defaultPlayerRecord,
    },
};
