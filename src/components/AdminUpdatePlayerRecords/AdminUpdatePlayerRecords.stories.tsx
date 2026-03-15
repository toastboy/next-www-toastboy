import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { GetProgressProxy } from '@/types/actions/GetProgress';
import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

import { AdminUpdatePlayerRecords } from './AdminUpdatePlayerRecords';

const onUpdatePlayerRecords = fn<UpdatePlayerRecordsProxy>().mockResolvedValue(undefined);
const getProgressInProgress = fn<GetProgressProxy>();
const getProgressCompleted = fn<GetProgressProxy>();

const meta = {
    title: 'Admin/AdminUpdatePlayerRecords',
    component: AdminUpdatePlayerRecords,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminUpdatePlayerRecords>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
    args: {
        onUpdatePlayerRecords,
        getProgress: getProgressInProgress,
    },
    beforeEach: () => {
        getProgressInProgress.mockResolvedValue([50, 100]);
    },
};

export const Completed: Story = {
    args: {
        onUpdatePlayerRecords,
        getProgress: getProgressCompleted,
    },
    beforeEach: () => {
        getProgressCompleted.mockResolvedValue([100, 100]);
    },
};

export const Primary: Story = InProgress;
