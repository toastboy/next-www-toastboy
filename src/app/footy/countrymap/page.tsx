export const dynamic = 'force-dynamic';

import { Paper, Text, Title } from '@mantine/core';

import { PlayerCountryMap } from '@/components/PlayerCountryMap/PlayerCountryMap';
import countrySupporterService from '@/services/CountrySupporter';

export const metadata = { title: 'Country Map' };

/**
 * Server page that renders a world map highlighting countries supported by
 * players. Fetches all country-supporter relationships (with country and
 * player data) and passes them to the {@link PlayerCountryMap} component,
 * which shows player mugshots on hover.
 */
const CountryMapPage = async () => {
    const countries = await countrySupporterService.getAllWithCountryAndPlayer();
    const uniqueCountryFifaCodes = new Set(countries.map((c) => c.country.fifaCode));

    return (
        <Paper shadow="xl" p="xl">
            <Title order={2} mb="md">Toastboy FC World Map</Title>
            <Text mb="md">
                This map highlights the {uniqueCountryFifaCodes.size} different countries supported by players. Hover over a country to see player details (scrollable).
            </Text>
            <PlayerCountryMap countries={countries} />
        </Paper>
    );
};

export default CountryMapPage;
