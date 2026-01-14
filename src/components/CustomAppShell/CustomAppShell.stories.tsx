import { Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CustomAppShell } from './CustomAppShell';

const meta = {
    title: 'Layout/CustomAppShell',
    component: CustomAppShell,
    tags: ['autodocs'],
} satisfies Meta<typeof CustomAppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: <Text>Page content goes here.</Text>,
    },
};
