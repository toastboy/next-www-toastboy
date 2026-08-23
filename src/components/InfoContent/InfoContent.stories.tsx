import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import type { SendEnquiryProxy } from '@/types/actions/SendEnquiry';

import { InfoContent } from './InfoContent';

const mockSendEnquiry = fn<SendEnquiryProxy>().mockResolvedValue(undefined);

const meta = {
    title: 'Pages/InfoContent',
    component: InfoContent,
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
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof InfoContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
