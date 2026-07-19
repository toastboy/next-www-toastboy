import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';

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
        // ImageWithPlaceholder marks its <img> aria-busy until the real
        // load/error event fires. Wait on that explicit signal rather than
        // polling the CSS opacity it also drives, which is subject to
        // transition-timing noise and forces a much longer timeout.
        await waitFor(() => {
            const img = canvas.getByRole('img', { name: /gary player/i, busy: false });
            return expect(img).toBeVisible();
        }, { timeout: 6000 });
    },
};

export const NoTrophies: Story = {
    args: {
        trophies: new Map(),
    },
};
