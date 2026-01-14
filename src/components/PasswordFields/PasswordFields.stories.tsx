import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PasswordFields } from './PasswordFields';

const meta = {
    title: 'Forms/PasswordFields',
    component: PasswordFields,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordFields>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        passwordProps: {
            name: 'password',
            defaultValue: '',
        },
        confirmPasswordProps: {
            name: 'confirmPassword',
            defaultValue: '',
        },
    },
};
