import { Flex } from '@mantine/core';
import CountryFlag from 'components/CountryFlag/CountryFlag';
import countrySupporterService from 'services/CountrySupporter';

export interface Props {
    playerId: number,
}

const PlayerCountries: React.FC<Props> = async ({ playerId }) => {
    const countries = await countrySupporterService.getByPlayer(playerId);

    if (!countries || countries.length === 0) return <></>;

    return (
        <Flex gap="xs" p="xs" direction="column">
            {countries.map((item) => (
                <CountryFlag key={item.countryISOCode} countryISOCode={item.countryISOCode} />
            ))}
        </Flex>
    );
};

export default PlayerCountries;
