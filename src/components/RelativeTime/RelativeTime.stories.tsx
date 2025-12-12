import type { Meta, StoryObj } from '@storybook/nextjs';

import RelativeTime from './RelativeTime';

const meta = {
    title: 'Utilities/RelativeTime',
    component: RelativeTime,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        date: new Date(),
    },
};
