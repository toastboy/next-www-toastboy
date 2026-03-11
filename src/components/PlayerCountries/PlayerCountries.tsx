import { Flex } from '@mantine/core';

import { CountryFlag } from '@/components/CountryFlag/CountryFlag';
import { CountrySupporterDataType } from '@/types';

export interface Props {
    countries: CountrySupporterDataType[];
}

export const PlayerCountries = ({ countries }: Props) => {
    return countries.length > 0 ? (
        <Flex gap="xs" p="xs" direction="column">
            {countries.map((item) => (
                <CountryFlag
                    key={item.countryFIFACode}
                    country={item.country}
                />
            ))}
        </Flex>
    ) : null;
};
