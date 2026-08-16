import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TablesShell } from './TablesShell';

const meta = {
    title: 'Pages/TablesShell',
    component: TablesShell,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TablesShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
