import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RulesContent } from './RulesContent';

const meta = {
    title: 'Pages/RulesContent',
    component: RulesContent,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof RulesContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
