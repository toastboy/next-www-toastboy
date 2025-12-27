import type { Meta, StoryObj } from '@storybook/nextjs';
import { within } from '@storybook/testing-library';
import { mocked } from 'storybook/test';

import { updatePlayer } from '@/actions/updatePlayer';
import {
    defaultClubList,
    defaultCountryList,
    defaultPlayerData,
    defaultPlayerEmails,
} from '@/tests/mocks';

import { PlayerProfileForm } from './PlayerProfileForm';

const meta = {
    title: 'Forms/PlayerProfileForm',
    component: PlayerProfileForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        player: defaultPlayerData,
        emails: defaultPlayerEmails,
        allCountries: defaultCountryList,
        allClubs: defaultClubList,
    },
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(updatePlayer).mockResolvedValue({
            id: 123,
        } as Awaited<ReturnType<typeof updatePlayer>>);

        const canvas = within(canvasElement);
        const nameInput = await canvas.findByLabelText(/Name/i);
        const emailInput = await canvas.findByLabelText(/Email address/i);
        const submitButton = await canvas.findByRole('button', { name: /Submit/i });

        await userEvent.type(nameInput, 'Pat Example');
        await userEvent.type(emailInput, 'pat@example.com');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Profile updated successfully', {}, { timeout: 6000 });
    },
};
