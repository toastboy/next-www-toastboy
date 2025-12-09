import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerList } from '@/tests/mocks';

import SendEmailForm from './SendEmailForm';

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
        players: defaultPlayerList.slice(0, 3),
    },
};
