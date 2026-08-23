import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';

import type { RecordHallHireProxy } from '@/types/actions/RecordHallHire';
import type { UpdateInvoiceGameDaysProxy } from '@/types/actions/UpdateInvoiceGameDays';

import { InvoiceForm } from './InvoiceForm';

const mockUpdateGameDays =
    fn<UpdateInvoiceGameDaysProxy>().mockResolvedValue(undefined);
const mockRecordHallHire =
    fn<RecordHallHireProxy>().mockResolvedValue(undefined);

const gameDays = [
    { id: 1, date: '2026-01-06', gameScheduled: true, hallCost: 4935 },
    { id: 2, date: '2026-01-13', gameScheduled: false, hallCost: 4935 },
    { id: 3, date: '2026-01-20', gameScheduled: true, hallCost: 4935 },
];

const meta = {
    title: 'Forms/InvoiceForm',
    component: InvoiceForm,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
    args: {
        year: 2026,
        month: 1,
        gameDays,
        alreadyRecorded: false,
        gaps: [],
        onUpdateGameDays: mockUpdateGameDays,
        onRecordHallHire: mockRecordHallHire,
    },
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof InvoiceForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotYetRecorded: Story = {};

export const AlreadyRecorded: Story = {
    args: {
        alreadyRecorded: true,
    },
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const submitButton = await canvas.findByRole('button', {
            name: /Record invoice/i,
        });
        await expect(submitButton).toBeDisabled();

        await userEvent.click(
            await canvas.findByLabelText('Game scheduled for 2026-01-13'),
        );
        await expect(submitButton).toBeEnabled();
    },
};

export const WithGaps: Story = {
    args: {
        gaps: [
            { year: 2025, month: 11 },
            { year: 2025, month: 12 },
        ],
    },
};
