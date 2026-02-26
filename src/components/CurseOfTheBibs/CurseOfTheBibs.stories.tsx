import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultBibsData } from '@/tests/mocks/data/bibs';

import { CurseOfTheBibs } from './CurseOfTheBibs';

const meta = {
    title: 'Charts/CurseOfTheBibs',
    component: CurseOfTheBibs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CurseOfTheBibs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        bibsData: defaultBibsData,
    },
};

