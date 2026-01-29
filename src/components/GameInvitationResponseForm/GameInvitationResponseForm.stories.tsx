import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within } from 'storybook/test';

import {
    createMockGameInvitationResponseDetails,
    defaultGameInvitationResponseDetails,
} from '@/tests/mocks/data/gameInvitationResponse';
import { SubmitGameInvitationResponseProxy } from '@/types/actions/SubmitGameInvitationResponse';

import { GameInvitationResponseForm } from './GameInvitationResponseForm';

const mockSubmitGameInvitationResponse =
    fn<SubmitGameInvitationResponseProxy>().mockResolvedValue({
        ...defaultGameInvitationResponseDetails,
        id: 1,
    });

const meta = {
    title: 'Forms/GameInvitationResponseForm',
    component: GameInvitationResponseForm,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
    args: {
        onSubmitGameInvitationResponse: mockSubmitGameInvitationResponse,
    },
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

        const canvas = within(canvasElement);
        await userEvent.selectOptions(await canvas.findByLabelText(/Response/i), 'Yes');
        await userEvent.click(await canvas.findByLabelText(/Goalie/i));
        await userEvent.type(await canvas.findByLabelText(/Optional comment/i), 'Count me in.');
        await userEvent.click(await canvas.findByRole('button', { name: /Done/i }));

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Response saved', {}, { timeout: 6000 });
    },
};
