import type { Meta, StoryObj } from '@storybook/nextjs';

import { ClaimSignup } from './ClaimSignup';

const meta = {
    title: 'Forms/ClaimSignup',
    component: ClaimSignup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ClaimSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
};
