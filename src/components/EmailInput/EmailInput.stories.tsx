import type { Meta, StoryObj } from '@storybook/nextjs';

import { EmailInput } from './EmailInput';

const meta = {
    title: 'Forms/EmailInput',
    component: EmailInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof EmailInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
