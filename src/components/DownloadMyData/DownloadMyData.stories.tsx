import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultDownloadMyDataPayload } from '@/tests/mocks/data/downloadMyData';

import DownloadMyData from './DownloadMyData';

const meta = {
    title: 'Account/DownloadMyData',
    component: DownloadMyData,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DownloadMyData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        data: defaultDownloadMyDataPayload,
    },
};
