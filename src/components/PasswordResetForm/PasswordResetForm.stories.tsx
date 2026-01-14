import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PasswordResetForm } from './PasswordResetForm';

const meta = {
    title: 'Forms/PasswordResetForm',
    component: PasswordResetForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordResetForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        token: 'storybook-token',
    },
};
