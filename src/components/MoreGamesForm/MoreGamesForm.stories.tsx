import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked,within  } from 'storybook/test';

import { createMoreGameDays } from '@/actions/createMoreGameDays';
import { defaultMoreGamesFormData } from '@/tests/mocks';

import { MoreGamesForm } from './MoreGamesForm';

const meta = {
    title: 'Forms/MoreGamesForm',
    component: MoreGamesForm,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MoreGamesForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        rows: defaultMoreGamesFormData.rows,
    },
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(createMoreGameDays).mockResolvedValue([] as Awaited<ReturnType<typeof createMoreGameDays>>);

        const canvas = within(canvasElement);
        const firstComment = await canvas.findByLabelText(
            `Comment for ${defaultMoreGamesFormData.rows[0].date}`,
        );
        const firstCheckbox = await canvas.findByLabelText(
            `Game scheduled for ${defaultMoreGamesFormData.rows[0].date}`,
        );
        const submitButton = await canvas.findByRole('button', { name: /Create game days/i });

        await userEvent.type(firstComment, 'Bring bibs');
        await userEvent.click(firstCheckbox);
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Game days created successfully', {}, { timeout: 6000 });
    },
};
