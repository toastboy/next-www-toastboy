import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
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

/**
 * Stateful wrapper used by interaction stories to mirror parent-driven refresh
 * behaviour after submit by updating the `responses` prop in-memory.
 */
const StatefulResponsesForm = (args: Story['args']) => {
    const [responses, setResponses] = useState(args.responses ?? []);

    return (
        <ResponsesForm
            gameId={args.gameId ?? 0}
            gameDate={args.gameDate ?? ''}
            responses={responses}
            submitResponse={async (payload) => {
                const result = await (args.submitResponse?.(payload) ?? Promise.resolve(null));
                setResponses((previous) => previous.map((row) => (
                    row.playerId === payload.playerId ?
                        {
                            ...row,
                            response: payload.response,
                            goalie: payload.goalie,
                            comment: payload.comment,
                        } :
                        row
                )));
                return result;
            }}
        />
    );
};

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
    render: (args) => <StatefulResponsesForm {...args} />,
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
        const noneGroup = await canvas.findByRole('region', { name: 'None' });
        const row = (await within(noneGroup).findAllByRole('group'))[0];
        if (!row) throw new Error('Missing none-group row');
        const playerId = Number(row.getAttribute('data-player-id'));

        const select = within(row).getByRole('combobox', { name: 'Response' });
        const goalie = within(row).getByRole('checkbox', { name: 'Goalie' });
        const comment = within(row).getByPlaceholderText('Comment');
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
        const submit = within(row).getByRole('button', { name: 'Update' });
        await userEvent.click(submit);

        await within(canvasElement.ownerDocument.body).findByText('Response updated', {}, { timeout: 6000 });

        const yesGroup = await canvas.findByRole('region', { name: 'Yes' });
        const movedRow = (await within(yesGroup).findAllByRole('group'))
            .find((r) => Number(r.getAttribute('data-player-id')) === playerId);
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

        const noneGroup = await canvas.findByRole('region', { name: 'None' });

        await Promise.all([
            expect(within(noneGroup).getByText('None: 1')).toBeInTheDocument(),
            expect(canvas.queryByRole('region', { name: 'Yes' })).toBeNull(),
            expect(canvas.queryByRole('region', { name: 'No' })).toBeNull(),
            expect(canvas.queryByRole('region', { name: 'Dunno' })).toBeNull(),
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
        const noneGroup = await canvas.findByRole('region', { name: 'None' });
        const row = (await within(noneGroup).findAllByRole('group'))[0];
        if (!row) throw new Error('Missing none-group row');

        const select = within(row).getByRole('combobox', { name: 'Response' });
        const submit = within(row).getByRole('button', { name: 'Update' });
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
