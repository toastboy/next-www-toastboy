import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PieChart } from './PieChart';

const meta = {
    title: 'Charts/PieChart',
    component: PieChart,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        data: [
            { label: 'Wins', value: 10 },
            { label: 'Draws', value: 4 },
            { label: 'Losses', value: 6 },
        ],
        width: 320,
        height: 320,
    },
};
