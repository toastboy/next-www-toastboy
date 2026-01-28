import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultPlayerDataList } from '@/tests/mocks/data/playerData';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

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

const sendEmail: SendEmailProxy = async () => Promise.resolve();

export const Primary: Story = {
    args: {
        opened: true,
        players: defaultPlayerDataList.slice(0, 3),
        onClose: () => undefined,
        onSendEmail: sendEmail,
    },
};
