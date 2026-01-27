import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within } from 'storybook/test';

import { defaultClubList } from '@/tests/mocks/data/club';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountryList } from '@/tests/mocks/data/country';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerData } from '@/tests/mocks/data/playerData';
import { defaultPlayerExtraEmails } from '@/tests/mocks/data/playerExtraEmail';
import type { UpdatePlayerProxy } from '@/types/actions/UpdatePlayer';

import { PlayerProfileForm } from './PlayerProfileForm';

const meta = {
    title: 'Forms/PlayerProfileForm',
    component: PlayerProfileForm,
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
} satisfies Meta<typeof PlayerProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultUpdatePlayerProxy: UpdatePlayerProxy = async (_playerId, _data) => {
    return Promise.resolve(defaultPlayer);
};

export const Render: Story = {
    args: {
        player: defaultPlayerData,
        extraEmails: defaultPlayerExtraEmails,
        countries: defaultCountrySupporterDataList,
        clubs: defaultClubSupporterDataList,
        allCountries: defaultCountryList,
        allClubs: defaultClubList,
        verifiedEmail: 'goalie@toastboy.co.uk',
        onUpdatePlayer: defaultUpdatePlayerProxy,
    },
};

export const ValidFill: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

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
