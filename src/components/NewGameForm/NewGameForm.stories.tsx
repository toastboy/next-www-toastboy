import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked, within } from 'storybook/test';

import { triggerInvitations } from '@/actions/triggerInvitations';
import { createMockInvitationDecision } from '@/tests/mocks/data/newGame';

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

export const Render: Story = {};

export const ReadySubmit: Story = {
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(triggerInvitations).mockResolvedValue(
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
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(triggerInvitations).mockResolvedValue(
            createMockInvitationDecision({ status: 'skipped', reason: 'too-early' }),
        );

        const canvas = within(canvasElement);
        await userEvent.click(await canvas.findByRole('button', { name: /Submit/i }));

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Invitations skipped', {}, { timeout: 6000 });
    },
};
