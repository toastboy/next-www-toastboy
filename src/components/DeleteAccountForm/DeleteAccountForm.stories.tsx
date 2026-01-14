import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, mocked, within } from 'storybook/test';

import { deletePlayer } from '@/actions/deletePlayer';

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

        mocked(deletePlayer).mockResolvedValue(
            undefined as Awaited<ReturnType<typeof deletePlayer>>,
        );

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
            /An email has been sent containing a link for you to confirm the deletion of your account./i,
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
        const confirmPhrase = await canvas.findByTestId('confirm-phrase-input');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.click(submitButton);

        // Mantine duplicates this text in the label and the error, so we assert the error via aria-describedby.
        await expect(confirmPhrase).toHaveAttribute('aria-invalid', 'true');

        const errorId = confirmPhrase.getAttribute('aria-describedby');
        if (!errorId) {
            throw new Error('Expected confirm phrase input to have aria-describedby pointing at the error element');
        }

        const errorEl = canvasElement.querySelector<HTMLElement>(`#${CSS.escape(errorId)}`);
        if (!errorEl) {
            throw new Error(`Expected to find error element with id "${errorId}"`);
        }

        await expect(errorEl.textContent ?? '').toMatch(/type delete to confirm/i);
    },
};
