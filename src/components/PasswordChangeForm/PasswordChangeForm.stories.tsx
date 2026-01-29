import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';
import { expect, fn, waitFor, within } from 'storybook/test';

import { PasswordChangeForm } from './PasswordChangeForm';

const changePasswordSpy = fn();

const meta = {
    title: 'Forms/PasswordChangeForm',
    component: PasswordChangeForm,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
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
    parameters: {
        msw: {
            handlers: [
                http.post('*/api/auth/change-password', async ({ request }) => {
                    const payload = await request.json();
                    changePasswordSpy(payload);
                    return HttpResponse.json({
                        token: null,
                        user: {
                            id: 'user-1',
                            name: 'Pat Player',
                            email: 'pat.player@example.com',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            emailVerified: true,
                            image: null,
                        },
                    });
                }),
            ],
        },
    },
};

export const ValidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        changePasswordSpy.mockClear();

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

        await waitFor(() => expect(changePasswordSpy).toHaveBeenCalled());
        const firstCallArg = changePasswordSpy.mock.calls[0][0] as {
            currentPassword: string;
            newPassword: string;
            revokeOtherSessions?: boolean;
        };
        await expect(firstCallArg).toEqual({
            currentPassword: 'current-password',
            newPassword: 'new-password',
            revokeOtherSessions: false,
        });
    },
};

export const InvalidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        changePasswordSpy.mockClear();

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

        await waitFor(() => expect(changePasswordSpy).toHaveBeenCalled());

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText(
            /Bad Request. Please try again/i,
            {},
            { timeout: 6000 },
        );
    },
    parameters: {
        msw: {
            handlers: [
                http.post('*/api/auth/change-password', async ({ request }) => {
                    const payload = await request.json();
                    changePasswordSpy(payload);
                    return HttpResponse.json(
                        { error: { message: 'Mock password change error' } },
                        { status: 400 },
                    );
                }),
            ],
        },
    },
};
