import type { Meta, StoryObj } from '@storybook/nextjs';

import { PasswordChangeForm } from './PasswordChangeForm';

const meta = {
    title: 'Forms/PasswordChangeForm',
    component: PasswordChangeForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordChangeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        revokeOtherSessions: false,
    },
};
