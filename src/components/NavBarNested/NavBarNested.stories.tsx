import type { Meta, StoryObj } from '@storybook/nextjs';

import { NavBarNested } from './NavBarNested';

const meta = {
    title: 'Navigation/NavBarNested',
    component: NavBarNested,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NavBarNested>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        user: {
            name: 'Test User',
            email: 'testuser@example.com',
            playerId: 1,
            role: 'user',
        },
    },
};
