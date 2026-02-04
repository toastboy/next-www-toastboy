import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within } from 'storybook/test';

import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import { defaultResponsesAdminData } from '@/tests/mocks/data/responses';

const meta = {
    title: 'Admin/Responses',
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

export const Primary: Story = {
    args: {
        gameId: 1249,
        gameDate: '3rd February 2026',
        responses: defaultResponsesAdminData,
        submitAdminResponse: async () => Promise.resolve(null),
    },
    play: async ({ canvasElement, viewMode }) => {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const noneGroup = await canvas.findByTestId('response-group-none');
        const firstRow = (await canvas.findAllByTestId('response-row')).find((row) =>
            noneGroup.contains(row),
        );
        if (!firstRow) throw new Error('Missing none-group row');

        const select = within(firstRow).getByTestId('response-select');
        const goalie = within(firstRow).getByTestId('goalie-checkbox');
        const comment = within(firstRow).getByTestId('comment-input');
        const submit = within(firstRow).getByTestId('response-submit');

        await userEvent.selectOptions(select, 'Yes');
        await userEvent.click(goalie);
        await userEvent.type(comment, 'Storybook play');
        await userEvent.click(submit);

        await within(canvasElement.ownerDocument.body).findByText('Response updated', {}, { timeout: 6000 });
    },
};
