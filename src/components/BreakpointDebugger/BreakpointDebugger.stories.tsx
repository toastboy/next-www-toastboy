import type { Meta, StoryObj } from '@storybook/nextjs';

import BreakpointDebugger from './BreakpointDebugger';

const meta = {
    title: 'Utilities/BreakpointDebugger',
    component: BreakpointDebugger,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BreakpointDebugger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
