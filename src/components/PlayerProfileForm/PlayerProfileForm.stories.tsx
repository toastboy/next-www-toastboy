import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked,within  } from 'storybook/test';

import { updatePlayer } from '@/actions/updatePlayer';
import {
    defaultClubList,
    defaultClubSupporterDataList,
    defaultCountryList,
    defaultCountrySupporterDataList,
    defaultPlayerData,
    defaultPlayerExtraEmails,
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

export const Render: Story = {
    args: {
        player: defaultPlayerData,
        extraEmails: defaultPlayerExtraEmails,
        countries: defaultCountrySupporterDataList,
        clubs: defaultClubSupporterDataList,
        allCountries: defaultCountryList,
        allClubs: defaultClubList,
        verifiedEmail: 'goalie@toastboy.co.uk',
    },
};

export const ValidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(updatePlayer).mockResolvedValue({
            id: 123,
        } as Awaited<ReturnType<typeof updatePlayer>>);

        const canvas = within(canvasElement);
        const nameInput = await canvas.findByTestId('name-input');
        const emailInput = await canvas.findByTestId('extra-email-input-1');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Gazza Playa');
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'g.player@sacked.com');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Profile updated successfully', {}, { timeout: 6000 });
    },
};

export const BlankName: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(updatePlayer).mockResolvedValue({
            id: 123,
        } as Awaited<ReturnType<typeof updatePlayer>>);

        const canvas = within(canvasElement);
        const nameInput = await canvas.findByTestId('name-input');
        const emailInput = await canvas.findByTestId('extra-email-input-1');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.clear(nameInput);
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'g.player@sacked.com');
        await userEvent.click(submitButton);

        const body = canvasElement.ownerDocument.body;
        await within(body).findByText('Name is required', {}, { timeout: 6000 });
    },
};
