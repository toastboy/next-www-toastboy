import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultArse } from '@/tests/mocks/data/arse';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';
import { defaultPlayerRecord, defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

import { PlayerProfile } from './PlayerProfile';

const meta = {
    title: 'Player/PlayerProfile',
    component: PlayerProfile,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        playerName: 'Lionel Scruffy',
        player: defaultPlayer,
        year: 2023,
        form: defaultPlayerFormList,
        lastPlayed: defaultPlayerFormList[9],
        clubs: defaultClubSupporterDataList,
        countries: defaultCountrySupporterDataList,
        arse: defaultArse,
        activeYears: [2020, 2021, 2022, 2023],
        record: defaultPlayerRecord,
        trophies: defaultTrophiesList,
    },
};
