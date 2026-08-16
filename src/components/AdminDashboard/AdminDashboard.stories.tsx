import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { GetProgressProxy } from '@/types/actions/GetProgress';
import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

import { AdminDashboard } from './AdminDashboard';

const onUpdatePlayerRecords =
    fn<UpdatePlayerRecordsProxy>().mockResolvedValue(undefined);
const getProgress = fn<GetProgressProxy>();
const onExportAuth = fn<() => Promise<void>>().mockResolvedValue(undefined);

const meta = {
    title: 'Admin/AdminDashboard',
    component: AdminDashboard,
    args: {
        onUpdatePlayerRecords,
        getProgress,
        onExportAuth,
    },
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    beforeEach: () => {
        getProgress.mockResolvedValue([100, 100]);
    },
};
