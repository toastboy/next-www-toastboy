import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AdminExportAuth } from './AdminExportAuth';

const meta = {
    title: 'Admin/AdminExportAuth',
    component: AdminExportAuth,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminExportAuth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
