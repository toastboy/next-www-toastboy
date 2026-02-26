import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultAdminUserDataPayload } from '@/tests/mocks/data/adminUserData';

import { AdminUserData } from './AdminUserData';

const meta = {
    title: 'Admin/AdminUserData',
    component: AdminUserData,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminUserData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        user: defaultAdminUserDataPayload,
    },
};
