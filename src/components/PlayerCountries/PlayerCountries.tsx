import { Flex } from '@mantine/core';

import { CountryFlag } from '@/components/CountryFlag/CountryFlag';
import { CountrySupporterDataType } from '@/types';

export interface Props {
    countries: CountrySupporterDataType[];
}

export const PlayerCountries = ({ countries }: Props) => {
    return countries.length > 0 ? (
        <Flex gap="2cqw" p="1cqw" direction="column">
            {countries.map((item) => (
                <CountryFlag
                    key={item.countryFIFACode}
                    country={item.country}
                    w="12cqw"
                    h="auto"
                />
            ))}
        </Flex>
    ) : null;
};
