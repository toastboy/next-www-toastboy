import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { GoalieIndicator } from './GoalieIndicator';

const meta = {
    component: GoalieIndicator,
    tags: ['ai-generated'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div style={{ position: 'relative', width: 200, height: 200 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof GoalieIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvas }) => {
        const indicator = canvas.getByRole('img', { name: /goalie indicator/i });
        await expect(indicator).toBeVisible();
        await expect(indicator.getAttribute('aria-label')).toBe('Goalie indicator');
    },
};
