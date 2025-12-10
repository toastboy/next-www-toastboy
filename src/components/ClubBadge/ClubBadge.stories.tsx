import type { Meta, StoryObj } from '@storybook/nextjs';
import { http, HttpResponse } from 'msw';

import { defaultClub } from '@/tests/mocks';
import image from '@/tests/mocks/data/badge.png';

import ClubBadge from './ClubBadge';

const imageUrl = typeof image === 'string' ? image : image.src;

const meta = {
    title: 'Club/ClubBadge',
    component: ClubBadge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ClubBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        club: defaultClub,
    },
    parameters: {
        msw: {
            handlers: [
                http.get('*/api/footy/club/:id/badge', async () => {
                    const res = await fetch(imageUrl);
                    const buffer = await res.arrayBuffer();

                    return new HttpResponse(buffer, {
                        headers: {
                            'Content-Type': 'image/png',
                        },
                    });
                }),
            ],
        },
    },
};
