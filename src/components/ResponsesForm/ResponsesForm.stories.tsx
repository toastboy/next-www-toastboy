import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within } from 'storybook/test';

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
        submitAdminResponse: async () => Promise.resolve(null),
    },
};

export const Update: Story = {
    ...Render,
    play: async ({ canvasElement, viewMode }) => {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const noneGroup = await canvas.findByTestId('response-group-none');
        const firstRow = (await canvas.findAllByTestId('response-row')).find((row) =>
            noneGroup.contains(row),
        );
        if (!firstRow) throw new Error('Missing none-group row');
        const playerId = Number(firstRow.getAttribute('data-player-id'));

        const select = within(firstRow).getByTestId('response-select');
        const goalie = within(firstRow).getByTestId('goalie-checkbox');
        const comment = within(firstRow).getByTestId('comment-input');
        await userEvent.click(goalie);
        await userEvent.type(comment, 'Storybook play');
        await userEvent.selectOptions(select, 'Yes');
        const submit = within(firstRow).getByTestId('response-submit');
        await userEvent.click(submit);

        await within(canvasElement.ownerDocument.body).findByText('Response updated', {}, { timeout: 6000 });

        const yesGroup = await canvas.findByTestId('response-group-yes');
        const movedRow = (await within(yesGroup).findAllByTestId('response-row'))
            .find((row) => Number(row.getAttribute('data-player-id')) === playerId);
        if (!movedRow) throw new Error('Missing moved row in yes-group after update');
    },
};
