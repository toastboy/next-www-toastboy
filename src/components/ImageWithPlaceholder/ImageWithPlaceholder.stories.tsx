import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ImageWithPlaceholder } from './ImageWithPlaceholder';

const meta = {
    title: 'Utilities/ImageWithPlaceholder',
    component: ImageWithPlaceholder,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ImageWithPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Square: Story = {
    args: {
        ratio: 1,
        w: '10rem',
        src: '/api/footy/club/1/badge',
        alt: 'Example square image',
    },
};

export const Flag: Story = {
    args: {
        ratio: 3 / 2,
        w: '10rem',
        src: '/api/footy/country/eng/flag',
        alt: 'Example flag image',
    },
};
