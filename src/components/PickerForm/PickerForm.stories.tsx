import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within } from 'storybook/test';

import { PickerForm } from '@/components/PickerForm/PickerForm';
import { defaultPickerAdminData } from '@/tests/mocks/data/picker';

const meta = {
    title: 'Admin/PickerForm',
    component: PickerForm,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PickerForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {
        gameDay: {
            id: 1249,
            year: 2026,
            date: new Date('2026-02-03T00:00:00Z'),
            game: true,
            cost: 500,
            mailSent: new Date('2026-02-01T09:00:00Z'),
            comment: null,
            bibs: null,
            pickerGamesHistory: 10,
        },
        players: defaultPickerAdminData,
        submitPicker: async () => Promise.resolve(),
        setGameEnabled: async () => Promise.resolve({
            id: 1249,
            year: 2026,
            date: new Date('2026-02-03T00:00:00Z'),
            game: true,
            cost: 500,
            mailSent: new Date('2026-02-01T09:00:00Z'),
            comment: null,
            bibs: null,
            pickerGamesHistory: 10,
        }),
    },
    parameters: {
        docs: {
            description: {
                story: 'Baseline rendering of the picker table with sortable columns and selection.',
            },
        },
    },
};

export const SimpleUpdate: Story = {
    ...Render,
    parameters: {
        docs: {
            description: {
                story: 'Deselects one player and submits the remaining selection.',
            },
        },
    },
    play: async ({ canvasElement, viewMode }) => {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const devCheckbox = await canvas.findByLabelText('Select Dev Striker');
        await userEvent.click(devCheckbox);

        const submitButton = await canvas.findByTestId('submit-picker-button');
        await userEvent.click(submitButton);

        await within(canvasElement.ownerDocument.body).findByText('Selection submitted', {}, { timeout: 6000 });
    },
};

export const InvalidInput: Story = {
    args: {
        ...Render.args,
        submitPicker: async () => {
            return Promise.reject(new Error('Invalid picker payload'));
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Simulates a rejected submit request and verifies the error alert is rendered.',
            },
        },
    },
    play: async ({ canvasElement, viewMode }) => {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const submitButton = await canvas.findByTestId('submit-picker-button');
        await userEvent.click(submitButton);

        await within(canvasElement.ownerDocument.body).findByRole('alert');
        await within(canvasElement.ownerDocument.body).findByText('Invalid picker payload');
    },
};
