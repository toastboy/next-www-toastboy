import { Flex } from '@mantine/core';
import { Activity } from 'react';

import { CountryFlag } from '@/components/CountryFlag/CountryFlag';
import { CountrySupporterDataType } from '@/types';

export interface Props {
    countries: CountrySupporterDataType[];
}

export const PlayerCountries = ({ countries }: Props) => {
    return (
        <Activity mode={countries.length > 0 ? 'visible' : 'hidden'}>
            <Flex gap="xs" p="xs" direction="column">
                {countries.map((item) => (
                    <CountryFlag
                        key={item.countryISOCode}
                        country={item.country}
                    />
                ))}
            </Flex>
        </Activity>
    );
};
