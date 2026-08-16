import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconCheck, IconX } from '@tabler/icons-react';

import { config } from '@/lib/config';

import { StatusNotification } from './StatusNotification';

const meta = {
    title: 'Utilities/StatusNotification',
    component: StatusNotification,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof StatusNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
    args: {
        icon: <IconX size={config.notificationIconSize} />,
        color: 'red',
        message: 'This invitation link is invalid.',
    },
};

export const Success: Story = {
    args: {
        icon: <IconCheck size={config.notificationIconSize} />,
        color: 'teal',
        withCloseButton: false,
        message: 'Thanks for your message. We will get back to you soon.',
    },
};

export const WithAnchor: Story = {
    args: {
        icon: <IconX size={config.notificationIconSize} />,
        color: 'red',
        withCloseButton: false,
        message: 'Unable to verify email.',
        anchor: { href: '/footy/profile', label: 'Return to your profile' },
    },
};

export const Plain: Story = {
    args: {
        variant: 'plain',
        message: 'Invitation details are missing.',
        anchor: { href: '/footy/game', label: 'Go to the game page' },
    },
};
