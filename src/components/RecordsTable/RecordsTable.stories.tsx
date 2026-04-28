import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

import { RecordsTable } from './RecordsTable';

const meta = {
    title: 'Tables/RecordsTable',
    component: RecordsTable,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof RecordsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        table: 'points',
        year: 2025,
        records: defaultPlayerRecordDataList,
    },
};
