import { Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { FootyChannel } from '@/types/FootyChannel';

import { YearPageShell } from './YearPageShell';

const meta = {
    title: 'Pages/YearPageShell',
    component: YearPageShell,
    args: {
        title: 'Books: ',
        year: 2024,
        validYears: [0, 2022, 2023, 2024],
        children: <Text>Page body content</Text>,
    },
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof YearPageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(
            canvas.findByText('Page body content'),
        ).resolves.toBeInTheDocument();
    },
};

export const WithAutoRefreshAndSubheading: Story = {
    args: {
        title: 'Games: ',
        autoRefreshChannels: [FootyChannel.Games, FootyChannel.Results],
        subheading: '5 played, 1 cancelled, 3 confirmed',
    },
};
