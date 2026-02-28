import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultAdminUserDataPayload } from '@/tests/mocks/data/adminUserData';
import type { SetAdminRoleProxy } from '@/types/actions/SetAdminRole';

import { AdminUserList } from './AdminUserList';

const setAdminRole: SetAdminRoleProxy = async () => Promise.resolve();

const sampleUsers = [
    defaultAdminUserDataPayload,
    {
        ...defaultAdminUserDataPayload,
        id: 'user_2',
        name: 'Victoria Veteran',
        email: 'victoria.veteran@example.com',
        role: 'user',
        createdAt: '2024-02-14T10:30:00.000Z',
        updatedAt: '2024-06-21T12:30:00.000Z',
    },
];

const meta = {
    title: 'Admin/AdminUserList',
    component: AdminUserList,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminUserList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        users: sampleUsers,
        setAdminRole,
    },
};

export const Empty: Story = {
    args: {
        users: [],
        setAdminRole,
    },
};
