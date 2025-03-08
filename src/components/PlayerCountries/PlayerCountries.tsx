import { Flex } from '@mantine/core';
import CountryFlag from 'components/CountryFlag/CountryFlag';
import { fetchData } from 'lib/fetch';
import { CountrySupporterWithCountry, Player } from 'lib/types';

export interface Props {
    player: Player,
}

const PlayerCountries: React.FC<Props> = async ({ player }) => {
    const countries = await fetchData<CountrySupporterWithCountry[]>(`/api/footy/player/${player.id}/countries`);

    if (!countries || countries.length == 0) return <></>;

    return (
        <Flex gap="xs" p="xs" direction="column">
            {countries.map((item) => (
                <CountryFlag key={item.countryISOCode} country={item.country} />
            ))}
        </Flex>
    );
};

export default PlayerCountries;
