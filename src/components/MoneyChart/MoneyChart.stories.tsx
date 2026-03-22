import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultMoneyChartData } from '@/tests/mocks/data/money';

import { MoneyChart } from './MoneyChart';

const meta = {
    title: 'Charts/MoneyChart',
    component: MoneyChart,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof MoneyChart>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        data: defaultMoneyChartData,
    },
};
