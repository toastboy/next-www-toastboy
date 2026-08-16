'use client';

import { Text, Title } from '@mantine/core';

import { PlayerCountryMap } from '@/components/PlayerCountryMap/PlayerCountryMap';
import { CountrySupporterWithPlayerDataType } from '@/types';

export interface Props {
    countries: CountrySupporterWithPlayerDataType[];
}

export const CountryMapShell = ({ countries }: Props) => {
    const uniqueCountryFifaCodes = new Set(
        countries.map((c) => c.country.fifaCode),
    );

    return (
        <>
            <Title
                order={2}
                mb="md"
            >
                Toastboy FC World Map
            </Title>
            <Text mb="md">
                This map highlights the {uniqueCountryFifaCodes.size} different
                countries supported by players. Hover over a country to see
                player details (scrollable).
            </Text>
            <PlayerCountryMap countries={countries} />
        </>
    );
};
