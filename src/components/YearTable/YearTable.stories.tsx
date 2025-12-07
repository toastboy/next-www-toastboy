import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

import YearTable from './YearTable';

const meta = {
    title: 'Tables/YearTable',
    component: YearTable,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof YearTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        table: 'averages',
        year: 2025,
        qualified: defaultPlayerRecordDataList,
        unqualified: defaultPlayerRecordDataList,
    },
};
