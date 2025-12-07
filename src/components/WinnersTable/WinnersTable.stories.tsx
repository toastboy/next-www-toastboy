import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

import WinnersTable from './WinnersTable';

const meta = {
    title: 'Tables/WinnersTable',
    component: WinnersTable,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof WinnersTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        table: 'points',
        records: defaultPlayerRecordDataList,
    },
};
