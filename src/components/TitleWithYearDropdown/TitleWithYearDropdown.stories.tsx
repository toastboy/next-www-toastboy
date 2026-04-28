import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { TitleWithYearDropdown } from './TitleWithYearDropdown';

const meta = {
    title: 'Tables/TitleWithYearDropdown',
    component: TitleWithYearDropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TitleWithYearDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: 'Testing Title',
        order: 2,
        year: 2019,
        validYears: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
    },
    play: async function ({ canvas }) {
        await userEvent.click(canvas.getByRole('button'));
        const body = within(document.body);
        await waitFor(() => expect(body.getByRole('menuitem', { name: '2018' })).toBeVisible());
    },
};
