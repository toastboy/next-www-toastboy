import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerList } from '@/tests/mocks';

import { NewPlayerForm } from './NewPlayerForm';

const meta = {
    title: 'Forms/NewPlayerForm',
    component: NewPlayerForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NewPlayerForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        players: defaultPlayerList,
    },
};
