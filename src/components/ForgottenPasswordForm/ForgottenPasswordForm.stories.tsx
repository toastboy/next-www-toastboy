import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within } from '@storybook/testing-library';
import { mocked } from 'storybook/test';

import { authClient } from '@/lib/auth-client';

import { ForgottenPasswordForm } from './ForgottenPasswordForm';

const meta = {
    title: 'Forms/ForgottenPasswordForm',
    component: ForgottenPasswordForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ForgottenPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {},
};

export const ValidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(authClient.requestPasswordReset).mockResolvedValue({
            status: true,
        } as Awaited<ReturnType<typeof authClient.requestPasswordReset>>);

        const canvas = within(canvasElement);
        const emailInput = await canvas.findByLabelText(/Email/i);
        const submitButton = await canvas.findByRole('button', { name: /Submit/i });

        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'g.player@sacked.com');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Check your email', {}, { timeout: 6000 });
    },
};

export const BlankFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const emailInput = await canvas.findByLabelText(/Email/i);
        const submitButton = await canvas.findByRole('button', { name: /Submit/i });

        await userEvent.clear(emailInput);
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Email is required', {}, { timeout: 6000 });
    },
};

export const InvalidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const emailInput = await canvas.findByLabelText(/Email/i);
        const submitButton = await canvas.findByRole('button', { name: /Submit/i });

        await userEvent.type(emailInput, 'invalid-email');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Invalid email', {}, { timeout: 6000 });
    },
};
