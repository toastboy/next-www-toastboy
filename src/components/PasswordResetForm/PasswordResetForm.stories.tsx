import type { Meta, StoryObj } from '@storybook/nextjs';
import { within } from '@storybook/testing-library';
import { mocked } from 'storybook/test';

import { updatePlayer } from '@/actions/updatePlayer';

import { PasswordResetForm } from './PasswordResetForm';

const meta = {
    title: 'Forms/PasswordResetForm',
    component: PasswordResetForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordResetForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {},
};

export const ValidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(updatePlayer).mockResolvedValue({
            id: 123,
        } as Awaited<ReturnType<typeof updatePlayer>>);

        const canvas = within(canvasElement);
        const emailInput = await canvas.findByLabelText(/^Email$/i);
        const submitButton = await canvas.findByRole('button', { name: /Submit/i });

        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'g.player@sacked.com');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Profile updated successfully', {}, { timeout: 6000 });
    },
};

export const BlankFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(updatePlayer).mockResolvedValue({
            id: 123,
        } as Awaited<ReturnType<typeof updatePlayer>>);

        const canvas = within(canvasElement);
        const submitButton = await canvas.findByRole('button', { name: /Submit/i });

        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Email is required', {}, { timeout: 6000 });
    },
};
