import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerRecord } from '@/tests/mocks';

import PlayerResults from './PlayerResults';

const meta = {
    title: 'Player/PlayerResults',
    component: PlayerResults,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        playerName: 'Lionel Scruffy',
        year: 2023,
        record: defaultPlayerRecord,
    },
};
