import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';
import { fn } from 'storybook/test';

import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

import { AdminUpdatePlayerRecords } from './AdminUpdatePlayerRecords';

const mockUpdatePlayerRecords = fn<UpdatePlayerRecordsProxy>().mockResolvedValue(undefined);

const meta = {
    title: 'Admin/AdminUpdatePlayerRecords',
    component: AdminUpdatePlayerRecords,
    args: {
        onUpdatePlayerRecords: mockUpdatePlayerRecords,
    },
    parameters: {
        layout: 'centered',
        msw: {
            handlers: [
                http.get('*/api/footy/records/progress', () => {
                    return HttpResponse.json([50, 100]);
                }),
            ],
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminUpdatePlayerRecords>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('*/api/footy/records/progress', () => {
                    return HttpResponse.json([50, 100]);
                }),
            ],
        },
    },
};

export const Completed: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('*/api/footy/records/progress', () => {
                    return HttpResponse.json([100, 100]);
                }),
            ],
        },
    },
};

export const Primary: Story = InProgress;
