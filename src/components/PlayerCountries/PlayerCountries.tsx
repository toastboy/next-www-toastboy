import { Flex } from '@mantine/core';
import CountryFlag from 'components/CountryFlag/CountryFlag';
import { Player } from 'lib/types';
import countrySupporterService from 'services/CountrySupporter';

export interface Props {
    player: Player,
}

const PlayerCountries: React.FC<Props> = async ({ player }) => {
    const data = await countrySupporterService.getByPlayer(player.id);

    if (!data || data.length == 0) return <></>;

    return (
        <Flex gap="xs" p="xs" direction="column">
            {data.map((item) => (
                <CountryFlag key={item.countryISOCode} country={item.country} />
            ))}
        </Flex>
    );
};

export default PlayerCountries;
