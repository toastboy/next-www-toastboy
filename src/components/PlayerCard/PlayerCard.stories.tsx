import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

import { PlayerCard } from './PlayerCard';

const meta = {
    component: PlayerCard,
    tags: ['ai-generated'],
    parameters: {
        layout: 'centered',
    },
    args: {
        player: defaultPlayer,
        clubs: defaultClubSupporterDataList,
        countries: defaultCountrySupporterDataList,
        trophies: defaultTrophiesList,
    },
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithClubsAndCountries: Story = {};

export const NoClubsOrCountries: Story = {
    args: {
        clubs: [],
        countries: [],
    },
    play: async ({ canvas }) => {
        // Mugshot image should render for the player
        const img = await canvas.findByRole('img', { name: /gary player/i });
        await expect(img).toBeVisible();
    },
};

export const NoTrophies: Story = {
    args: {
        trophies: new Map(),
    },
};
