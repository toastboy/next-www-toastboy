import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked, within } from 'storybook/test';

import { authClient } from '@/lib/auth-client';

import { PasswordChangeForm } from './PasswordChangeForm';

const meta = {
    title: 'Forms/PasswordChangeForm',
    component: PasswordChangeForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordChangeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {
        revokeOtherSessions: false,
    },
};

export const ValidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const currentPassword = await canvas.findByTestId('current-password-input');
        const newPassword = await canvas.findByTestId('password-input');
        const confirmPassword = await canvas.findByTestId('confirm-password-input');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.clear(currentPassword);
        await userEvent.type(currentPassword, 'current-password');
        await userEvent.clear(newPassword);
        await userEvent.type(newPassword, 'new-password');
        await userEvent.clear(confirmPassword);
        await userEvent.type(confirmPassword, 'new-password');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText(
            'Your password has been updated successfully.',
            {},
            { timeout: 6000 },
        );
    },
};

export const InvalidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(authClient.changePassword).mockImplementationOnce(() => {
            const error = new Error('Mock password change error') as Error & {
                error?: { message?: string };
            };
            error.error = { message: 'Mock password change error' };
            return Promise.reject(error);
        });

        const canvas = within(canvasElement);
        const currentPassword = await canvas.findByTestId('current-password-input');
        const newPassword = await canvas.findByTestId('password-input');
        const confirmPassword = await canvas.findByTestId('confirm-password-input');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.clear(currentPassword);
        await userEvent.type(currentPassword, 'bad-password');
        await userEvent.clear(newPassword);
        await userEvent.type(newPassword, 'new-password');
        await userEvent.clear(confirmPassword);
        await userEvent.type(confirmPassword, 'new-password');
        await userEvent.click(submitButton);

        const errorNotification = await canvas.findByTestId('error-notification');
        await within(errorNotification).findByText(
            /Mock password change error/,
            { selector: '.mantine-Notification-description' },
            { timeout: 6000 },
        );
    },
};
