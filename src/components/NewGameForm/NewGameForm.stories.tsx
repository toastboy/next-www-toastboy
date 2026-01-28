import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked, within } from 'storybook/test';

import { createMockInvitationDecision } from '@/tests/mocks/data/newGame';
import type { TriggerInvitationsProxy } from '@/types/actions/TriggerInvitations';

import { NewGameForm } from './NewGameForm';

const meta = {
    title: 'Forms/NewGameForm',
    component: NewGameForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NewGameForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTriggerInvitations: TriggerInvitationsProxy = async () =>
    Promise.resolve(createMockInvitationDecision({ status: 'ready', reason: 'ready' }));

export const Render: Story = {
    args: {
        onTriggerInvitations: mockTriggerInvitations,
    },
};

export const ReadySubmit: Story = {
    args: {
        onTriggerInvitations: mockTriggerInvitations,
    },
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(mockTriggerInvitations).mockResolvedValue(
            createMockInvitationDecision({ status: 'ready', reason: 'ready' }),
        );

        const canvas = within(canvasElement);
        await userEvent.click(await canvas.findByLabelText(/Override time check/i));
        await userEvent.type(await canvas.findByLabelText(/Custom message/i), 'See you soon.');
        await userEvent.click(await canvas.findByRole('button', { name: /Submit/i }));

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Invitations ready', {}, { timeout: 6000 });
    },
};

export const SkippedSubmit: Story = {
    args: {
        onTriggerInvitations: mockTriggerInvitations,
    },
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(mockTriggerInvitations).mockResolvedValue(
            createMockInvitationDecision({ status: 'skipped', reason: 'too-early' }),
        );

        const canvas = within(canvasElement);
        await userEvent.click(await canvas.findByRole('button', { name: /Submit/i }));

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Invitations skipped', {}, { timeout: 6000 });
    },
};
