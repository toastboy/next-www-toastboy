import { Flex } from '@mantine/core';
import { CountryFlag } from 'components/CountryFlag/CountryFlag';

import { CountrySupporterDataType } from '@/types';

export interface Props {
    countries: CountrySupporterDataType[];
}

export const PlayerCountries: React.FC<Props> = ({ countries }) => {
    if (countries.length === 0) return <></>;

    return (
        <Flex gap="xs" p="xs" direction="column">
            {countries.map((item) => (
                <CountryFlag
                    key={item.countryISOCode}
                    country={item.country}
                />
            ))}
        </Flex>
    );
};
