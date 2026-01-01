import type { Meta, StoryObj } from '@storybook/nextjs';

import { PasswordReset } from './PasswordReset';

const meta = {
    title: 'Forms/PasswordReset',
    component: PasswordReset,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordReset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        token: 'storybook-token',
    },
};
