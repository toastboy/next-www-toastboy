import type { Meta, StoryObj } from '@storybook/nextjs';
import { within } from 'storybook/test';

import { DeleteAccountForm } from './DeleteAccountForm';

const meta = {
    title: 'Forms/DeleteAccountForm',
    component: DeleteAccountForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DeleteAccountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {},
};

export const ValidSubmit: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const confirmPhrase = await canvas.findByTestId('confirm-phrase-input');
        const confirmPii = await canvas.findByTestId('confirm-pii-checkbox');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.clear(confirmPhrase);
        await userEvent.type(confirmPhrase, 'DELETE');
        await userEvent.click(confirmPii);
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText(
            /data deletion request has been received/i,
            {},
            { timeout: 6000 },
        );
    },
};

export const InvalidSubmit: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.click(submitButton);

        await canvas.findByText('Please type DELETE to confirm');
    },
};
