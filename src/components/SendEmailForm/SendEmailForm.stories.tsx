import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import type { PlayerDataEmailDisplayType } from '@/types';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

import { SendEmailForm } from './SendEmailForm';

const meta = {
    title: 'Email/SendEmailForm',
    component: SendEmailForm,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SendEmailForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const sendEmail: SendEmailProxy = async () => Promise.resolve();

const storyPlayers: PlayerDataEmailDisplayType[] = [
    { id: 1, name: 'Gary Player', accountEmail: 'gary@example.com', extraEmails: [{ email: 'gary.alt@example.com', verified: true }] },
    { id: 2, name: 'Alice Smith', accountEmail: 'alice@example.com', extraEmails: [] },
    { id: 3, name: 'Bob Jones', accountEmail: null, extraEmails: [{ email: 'bob@example.com', verified: false }] },
];

export const Primary: Story = {
    args: {
        opened: true,
        players: storyPlayers,
        onClose: () => undefined,
        onSendEmail: sendEmail,
        withinPortal: false,
        withOverlay: false,
    },
};
