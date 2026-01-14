import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { YearSelector } from './YearSelector';

const meta = {
    title: 'Tables/YearSelector',
    component: YearSelector,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof YearSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        activeYear: 2019,
        validYears: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    },
    play: async function ({ _fargs, canvas, userEvent }) {
        const button = canvas.getByText('2018');

        await userEvent.click(button);
    },
};
