import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TableIndexList } from './TableIndexList';

const meta = {
    title: 'Tables/TableIndexList',
    component: TableIndexList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TableIndexList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
