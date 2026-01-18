import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within } from '@storybook/testing-library';
import { mocked } from 'storybook/test';

import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import { createMockGameInvitationResponseDetails } from '@/tests/mocks';

import { GameInvitationResponseForm } from './GameInvitationResponseForm';

const meta = {
    title: 'Forms/GameInvitationResponseForm',
    component: GameInvitationResponseForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GameInvitationResponseForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyResponse: Story = {
    args: {
        details: createMockGameInvitationResponseDetails({ response: null, comment: null }),
    },
};

export const SubmitResponse: Story = {
    args: {
        details: createMockGameInvitationResponseDetails(),
    },
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(submitGameInvitationResponse).mockResolvedValue(null);

        const canvas = within(canvasElement);
        await userEvent.selectOptions(await canvas.findByLabelText(/Response/i), 'Yes');
        await userEvent.click(await canvas.findByLabelText(/Goalie/i));
        await userEvent.type(await canvas.findByLabelText(/Optional comment/i), 'Count me in.');
        await userEvent.click(await canvas.findByRole('button', { name: /Done/i }));

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Response saved', {}, { timeout: 6000 });
    },
};
