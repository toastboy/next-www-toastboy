import type { Meta, StoryObj } from '@storybook/nextjs';
import { http, HttpResponse } from 'msw';

import { AdminUpdatePlayerRecords } from './AdminUpdatePlayerRecords';


const meta = {
    title: 'Admin/AdminUpdatePlayerRecords',
    component: AdminUpdatePlayerRecords,
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

