import { Group, Paper, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerCountryMap } from '@/components/PlayerCountryMap/PlayerCountryMap';
import { defaultCountrySupporterWithPlayerDataList } from '@/tests/mocks/data/countrySupporterWithPlayerData';

import Loading from './loading';

const meta = {
    title: 'Loading/CountryMapPage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Skeleton loading state. */
export const Skeleton: Story = {};

/** Side-by-side comparison of loading and loaded states. */
export const Comparison: Story = {
    render: () => (
        <Group align="flex-start" gap="xl" wrap="nowrap">
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loading</Text>
                <Loading />
            </Stack>
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loaded</Text>
                <Paper shadow="xl" p="xl">
                    <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
                </Paper>
            </Stack>
        </Group>
    ),
};
