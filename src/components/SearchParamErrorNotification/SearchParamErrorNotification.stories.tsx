import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SearchParamErrorNotification } from './SearchParamErrorNotification';

const meta = {
    title: 'Utilities/SearchParamErrorNotification',
    component: SearchParamErrorNotification,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SearchParamErrorNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
