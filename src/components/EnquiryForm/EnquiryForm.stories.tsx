import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';

import { SendEnquiryProxy } from '@/types/actions/SendEnquiry';

import { EnquiryForm } from './EnquiryForm';

const mockSendEnquiry = fn<SendEnquiryProxy>().mockResolvedValue(undefined);

const meta = {
    title: 'Forms/EnquiryForm',
    component: EnquiryForm,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
    args: {
        onSendEnquiry: mockSendEnquiry,
    },
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
