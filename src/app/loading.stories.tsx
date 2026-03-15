import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Loading from './loading';

const meta = {
    title: 'Loading/Root',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spinner: Story = {};
