import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

import { WinnersGrid } from './WinnersGrid';

const meta = {
    title: 'Tables/WinnersGrid',
    component: WinnersGrid,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof WinnersGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        winners: [
            { table: 'points', records: defaultPlayerRecordDataList },
            { table: 'averages', records: defaultPlayerRecordDataList },
            { table: 'stalwart', records: defaultPlayerRecordDataList },
        ],
    },
};
