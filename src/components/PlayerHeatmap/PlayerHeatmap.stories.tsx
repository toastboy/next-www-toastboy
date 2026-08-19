import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';

import { PlayerHeatmap } from './PlayerHeatmap';

const meta = {
    title: 'Player/PlayerHeatmap',
    component: PlayerHeatmap,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerHeatmap>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SingleYear: Story = {
    args: {
        data: defaultPlayerFormList,
        year: 2021,
    },
};

export const AllTime: Story = {
    args: {
        data: defaultPlayerFormList,
        year: 0,
    },
};

export const Empty: Story = {
    args: {
        data: [],
        year: 2021,
    },
};
