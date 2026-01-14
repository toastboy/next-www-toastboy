import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultTurnoutByYearList } from '@/tests/mocks';

import { Turnout } from './Turnout';

const meta = {
    title: 'Tables/Turnout',
    component: Turnout,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Turnout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        turnout: defaultTurnoutByYearList,
    },
};
