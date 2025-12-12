import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerRecord } from '@/tests/mocks';

import { TableScore } from './TableScore';

const meta = {
    title: 'Tables/TableScore',
    component: TableScore,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TableScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        table: 'averages',
        playerRecord: defaultPlayerRecord,
    },
};
