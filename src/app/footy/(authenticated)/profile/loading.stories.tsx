import { Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { defaultClubList } from '@/tests/mocks/data/club';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountryList } from '@/tests/mocks/data/country';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerData } from '@/tests/mocks/data/playerData';
import { defaultPlayerExtraEmails } from '@/tests/mocks/data/playerExtraEmail';

import Loading from './loading';

const meta = {
    title: 'Loading/ProfilePage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Skeleton: Story = {};

export const Comparison: Story = {
    render: () => (
        <Group align="flex-start" gap="xl" wrap="nowrap">
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loading</Text>
                <Loading />
            </Stack>
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loaded</Text>
                <PlayerProfileForm
                    player={defaultPlayerData}
                    extraEmails={defaultPlayerExtraEmails}
                    countries={defaultCountrySupporterDataList}
                    clubs={defaultClubSupporterDataList}
                    allCountries={defaultCountryList}
                    allClubs={defaultClubList}
                    onUpdatePlayer={async () => Promise.resolve(defaultPlayer)}
                />
            </Stack>
        </Group>
    ),
};
