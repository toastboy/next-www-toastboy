import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerDataList } from '@/tests/mocks';

import { SendEmailForm } from './SendEmailForm';

const meta = {
    title: 'Email/SendEmailForm',
    component: SendEmailForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SendEmailForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        opened: true,
        onClose: () => undefined,
        players: defaultPlayerDataList.slice(0, 3),
    },
};
