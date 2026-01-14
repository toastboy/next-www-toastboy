import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RichTextMailBody } from './RichTextMailBody';

const meta = {
    title: 'Email/RichTextMailBody',
    component: RichTextMailBody,
    tags: ['autodocs'],
} satisfies Meta<typeof RichTextMailBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
