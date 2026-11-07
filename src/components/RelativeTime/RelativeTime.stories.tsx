import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RelativeTime } from './RelativeTime';

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
        // Two hours back, not new Date(): "a few seconds ago" can tip over to
        // "a minute ago" if the snapshot is taken late, whereas "2 hours ago"
        // holds for well over the time a capture takes.
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
};
