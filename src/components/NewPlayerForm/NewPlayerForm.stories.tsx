import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within } from '@storybook/testing-library';
import { mocked } from 'storybook/test';

import { createPlayer } from '@/actions/createPlayer';
import { defaultPlayerDataList } from '@/tests/mocks';

import { NewPlayerForm } from './NewPlayerForm';

const meta = {
    title: 'Forms/NewPlayerForm',
    component: NewPlayerForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NewPlayerForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        players: defaultPlayerDataList.slice(0, 3),
    },
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(createPlayer).mockResolvedValue({
            player: { id: 123 },
            inviteLink: 'http://example.com/footy/auth/claim?token=storybook',
        } as Awaited<ReturnType<typeof createPlayer>>);

        const canvas = within(canvasElement);
        const nameInput = await canvas.findByLabelText(/Name/i);
        const emailInput = await canvas.findByLabelText(/Email address/i);
        const introducedBySelect = await canvas.findByLabelText(/Introduced by/i);
        const submitButton = await canvas.findByRole('button', { name: /Submit/i });

        await userEvent.type(nameInput, 'Pat Example');
        await userEvent.type(emailInput, 'pat@example.com');
        await userEvent.selectOptions(introducedBySelect, '1');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Player created successfully', {}, { timeout: 6000 });
    },
};
