import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

import { TableQualified } from './TableQualified';

const meta = {
    title: 'Tables/TableQualified',
    component: TableQualified,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TableQualified>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        table: 'points',
        title: 'Football Peace Prize Standings',
        year: 2025,
        records: defaultPlayerRecordDataList,
    },
};
