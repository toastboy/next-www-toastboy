import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { UserButton } from './UserButton';

const meta = {
    title: 'Navigation/UserButton',
    component: UserButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof UserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
    args: {
        user: null,
    },
};

export const LoggedIn: Story = {
    args: {
        user: {
            name: 'Test User',
            email: 'testuser@example.com',
            playerId: 1,
            role: 'user',
        },
    },
};
