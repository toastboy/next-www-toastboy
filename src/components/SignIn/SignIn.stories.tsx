import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SignIn } from './SignIn';

const meta = {
    title: 'Auth/SignIn',
    component: SignIn,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        admin: false,
    },
};
