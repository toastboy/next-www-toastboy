import type { Meta, StoryObj } from '@storybook/nextjs';

import EnquiryForm from './EnquiryForm';

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

export const Primary: Story = {};
