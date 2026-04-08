import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { createMockCountry } from '@/tests/mocks/data/country';
import {
    createMockCountrySupporterWithPlayerData,
    defaultCountrySupporterWithPlayerDataList,
} from '@/tests/mocks/data/countrySupporterWithPlayerData';
import { createMockPlayer } from '@/tests/mocks/data/player';

import { PlayerCountryMap } from './PlayerCountryMap';

const meta = {
    title: 'Country/PlayerCountryMap',
    component: PlayerCountryMap,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerCountryMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default story with the standard mock countries list (UK home nations). */
export const Default: Story = {
    args: {
        countries: defaultCountrySupporterWithPlayerDataList,
    },
};

/** No countries highlighted. */
export const Empty: Story = {
    args: {
        countries: [],
    },
};

/** Single supported country. */
export const SingleCountry: Story = {
    args: {
        countries: [
            createMockCountrySupporterWithPlayerData({
                playerId: 1,
                countryFIFACode: 'BRA',
                country: createMockCountry({
                    fifaCode: 'BRA',
                    name: 'Brazil',
                }),
                player: createMockPlayer({ id: 1, name: 'Ronaldo' }),
            }),
        ],
    },
};

/** Compact variant with smaller dimensions. */
export const Compact: Story = {
    args: {
        countries: defaultCountrySupporterWithPlayerDataList,
        width: 480,
        height: 280,
    },
};
