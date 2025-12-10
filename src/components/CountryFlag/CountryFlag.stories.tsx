import type { Meta, StoryObj } from '@storybook/nextjs';
import { http, HttpResponse } from 'msw';

import { defaultCountry } from '@/tests/mocks';
import image from '@/tests/mocks/data/flag.png';

import CountryFlag from './CountryFlag';

const imageUrl = typeof image === 'string' ? image : image.src;

const meta = {
    title: 'Country/CountryFlag',
    component: CountryFlag,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CountryFlag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        country: defaultCountry,
    },
    parameters: {
        msw: {
            handlers: [
                http.get('*/api/footy/country/:id/flag', async () => {
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
