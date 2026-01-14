import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';

import { defaultPlayerDataList } from '@/tests/mocks/data/playerData';

import { AdminPlayerList } from './AdminPlayerList';

const samplePlayers = defaultPlayerDataList.slice(0, 8);

const meta = {
    title: 'Admin/AdminPlayerList',
    component: AdminPlayerList,
    parameters: {
        layout: 'padded',
        msw: {
            handlers: [
                http.get('*/api/footy/players', () => {
                    return HttpResponse.json(samplePlayers);
                }),
            ],
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AdminPlayerList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('*/api/footy/players', () => {
                    return HttpResponse.json([]);
                }),
            ],
        },
    },
};
