import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

import { HomeContent } from './HomeContent';

const meta = {
    title: 'Pages/HomeContent',
    component: HomeContent,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof HomeContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        year: 2025,
        tables: ['points', 'averages', 'stalwart'],
        tableRecords: [
            defaultPlayerRecordDataList,
            defaultPlayerRecordDataList,
            defaultPlayerRecordDataList,
        ],
    },
};
