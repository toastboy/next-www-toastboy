import type { Meta, StoryObj } from '@storybook/nextjs';

import { NYI } from './NYI';

const meta = {
    title: 'Utilities/NYI',
    component: NYI,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NYI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
