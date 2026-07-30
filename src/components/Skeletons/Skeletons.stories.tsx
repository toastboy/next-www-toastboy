import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { SkeletonRecordsProgress } from './Skeletons';

const meta = {
    component: SkeletonRecordsProgress,
    tags: ['ai-generated'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof SkeletonRecordsProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RecordsProgress: Story = {
    play: async ({ canvas }) => {
        const container = canvas.getByRole('status', { name: /loading player records/i });
        await expect(container).toBeVisible();
    },
};

// CssCheck: proves @mantine/core/styles.css loaded by verifying Mantine Skeleton
// applies overflow: hidden (from .mantine-Skeleton-root CSS class).
export const CssCheck: Story = {
    play: async ({ canvasElement }) => {
        const skeleton = canvasElement.querySelector('.mantine-Skeleton-root');
        await expect(skeleton).not.toBeNull();
        await expect(getComputedStyle(skeleton!).overflow).toBe('hidden');
    },
};
