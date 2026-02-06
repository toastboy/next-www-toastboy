import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import { defaultResponsesAdminData } from '@/tests/mocks/data/responses';

const meta = {
    title: 'Admin/ResponsesForm',
    component: ResponsesForm,
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
} satisfies Meta<typeof ResponsesForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {
        gameId: 1249,
        gameDate: '3rd February 2026',
        responses: defaultResponsesAdminData,
        submitResponse: async () => Promise.resolve(null),
    },
    parameters: {
        docs: {
            description: {
                story: 'Baseline rendering of grouped responses with no interaction.',
            },
        },
    },
};

export const SimpleUpdate: Story = {
    ...Render,
    parameters: {
        docs: {
            description: {
                story: 'Simple happy-path update: edit one pending player and confirm they move into the Yes group.',
            },
        },
    },
    play: async ({ canvasElement, viewMode }) => {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const filterInput = await canvas.findByPlaceholderText('Search players');
        await userEvent.clear(filterInput);
        const noneGroup = await canvas.findByTestId('response-group-none');
        const row = (await canvas.findAllByTestId('response-row')).find((candidate) =>
            noneGroup.contains(candidate),
        );
        if (!row) throw new Error('Missing none-group row');
        const playerId = Number(row.getAttribute('data-player-id'));

        const select = within(row).getByTestId('response-select');
        const goalie = within(row).getByTestId('goalie-checkbox');
        const comment = within(row).getByTestId('comment-input');
        await userEvent.click(goalie);
        await userEvent.type(comment, 'Storybook play');
        await userEvent.click(select);
        const dropdowns = await within(canvasElement.ownerDocument.body).findAllByRole('listbox');
        const dropdown = dropdowns[dropdowns.length - 1];
        await userEvent.click(
            await within(dropdown).findByRole(
                'option',
                { name: 'Yes', hidden: true },
            ),
        );
        const submit = within(row).getByTestId('response-submit');
        await userEvent.click(submit);

        await within(canvasElement.ownerDocument.body).findByText('Response updated', {}, { timeout: 6000 });

        const yesGroup = await canvas.findByTestId('response-group-yes');
        const movedRow = (await within(yesGroup).findAllByTestId('response-row'))
            .find((row) => Number(row.getAttribute('data-player-id')) === playerId);
        if (!movedRow) throw new Error('Missing moved row in yes-group after update');
    },
};

export const Filtering: Story = {
    ...Render,
    parameters: {
        docs: {
            description: {
                story: 'Applies a player name filter and verifies group counts and visible rows update accordingly.',
            },
        },
    },
    play: async ({ canvasElement, viewMode }) => {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const filterInput = await canvas.findByPlaceholderText('Search players');
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, 'Casey');

        const noneGroup = await canvas.findByTestId('response-group-none');

        await Promise.all([
            expect(noneGroup).toHaveAttribute('data-count', '1'),
            expect(canvas.queryByTestId('response-group-yes')).toBeNull(),
            expect(canvas.queryByTestId('response-group-no')).toBeNull(),
            expect(canvas.queryByTestId('response-group-dunno')).toBeNull(),
        ]);
        await within(noneGroup).findByText('Casey Mid');
    },
};

export const InvalidInput: Story = {
    args: {
        ...Render.args,
        submitResponse: async () => {
            return Promise.reject(new Error('Invalid response payload'));
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Simulates a rejected submit request and verifies the error alert is rendered for invalid input.',
            },
        },
    },
    play: async ({ canvasElement, viewMode }) => {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const filterInput = await canvas.findByPlaceholderText('Search players');
        await userEvent.clear(filterInput);
        const noneGroup = await canvas.findByTestId('response-group-none');
        const row = (await canvas.findAllByTestId('response-row')).find((candidate) =>
            noneGroup.contains(candidate),
        );
        if (!row) throw new Error('Missing none-group row');

        const select = within(row).getByTestId('response-select');
        const submit = within(row).getByTestId('response-submit');
        await userEvent.click(select);
        const dropdowns = await within(canvasElement.ownerDocument.body).findAllByRole('listbox');
        const dropdown = dropdowns[dropdowns.length - 1];
        await userEvent.click(
            await within(dropdown).findByRole(
                'option',
                { name: 'Yes', hidden: true },
            ),
        );
        await userEvent.click(submit);

        await within(canvasElement.ownerDocument.body).findByRole('alert');
        await within(canvasElement.ownerDocument.body).findByText('Invalid response payload');
    },
};
