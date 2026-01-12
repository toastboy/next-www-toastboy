import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, mocked, within } from 'storybook/test';

import { sendEnquiry } from '@/actions/sendEnquiry';

import { EnquiryForm } from './EnquiryForm';

const meta = {
    title: 'Forms/EnquiryForm',
    component: EnquiryForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof EnquiryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {
        redirectUrl: '/thank-you-for-reaching-out',
    },
};

export const ValidSubmit: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(sendEnquiry).mockResolvedValue(
            undefined as Awaited<ReturnType<typeof sendEnquiry>>,
        );

        const canvas = within(canvasElement);
        await userEvent.type(await canvas.findByTestId('enquiry-name'), 'Test User');
        await userEvent.type(await canvas.findByTestId('enquiry-email'), 'test@example.com');
        await userEvent.type(await canvas.findByTestId('enquiry-message'), 'Hello there');
        await userEvent.click(await canvas.findByTestId('enquiry-submit'));

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText(/Check your inbox and verify your email to deliver the message./i, {}, { timeout: 6000 });
    },
};

export const InvalidSubmit: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        await userEvent.click(await canvas.findByTestId('enquiry-submit'));

        await expect(await canvas.findByTestId('enquiry-name')).toHaveAttribute('aria-invalid', 'true');
        await expect(await canvas.findByTestId('enquiry-email')).toHaveAttribute('aria-invalid', 'true');
        await expect(await canvas.findByTestId('enquiry-message')).toHaveAttribute('aria-invalid', 'true');
    },
};
