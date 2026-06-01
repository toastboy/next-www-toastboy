import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { SkeletonRecordsProgress, SkeletonTableRows } from './Skeletons';

const tableMeta = {
    component: SkeletonTableRows,
    tags: ['ai-generated'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof SkeletonTableRows>;

export default tableMeta;
type TableStory = StoryObj<typeof tableMeta>;

export const DefaultRows: TableStory = {
    args: { rows: 10, cols: 2 },
};

export const FewRows: TableStory = {
    args: { rows: 3, cols: 4 },
};

// CssCheck: proves @mantine/core/styles.css loaded by verifying Mantine Skeleton
// applies overflow: hidden (from .mantine-Skeleton-root CSS class).
export const CssCheck: TableStory = {
    args: { rows: 1, cols: 1 },
    play: async ({ canvasElement }) => {
        const skeleton = canvasElement.querySelector('.mantine-Skeleton-root');
        await expect(skeleton).not.toBeNull();
        await expect(getComputedStyle(skeleton!).overflow).toBe('hidden');
    },
};

export const RecordsProgress: StoryObj<typeof SkeletonRecordsProgress> = {
    render: () => <SkeletonRecordsProgress />,
    play: async ({ canvas }) => {
        const container = canvas.getByRole('status', { name: /loading player records/i });
        await expect(container).toBeVisible();
    },
};
