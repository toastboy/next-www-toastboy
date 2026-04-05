import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Loading from './loading';

/** Skeleton-only story — InvoiceForm does not yet have a component-level story. */
const meta = {
    title: 'Loading/InvoicePage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Skeleton: Story = {};
