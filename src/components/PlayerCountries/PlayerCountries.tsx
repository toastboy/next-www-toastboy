import { Flex } from '@mantine/core';
import { CountryFlag } from 'components/CountryFlag/CountryFlag';
import { Activity } from 'react';

import { CountrySupporterDataType } from '@/types';

export interface Props {
    countries: CountrySupporterDataType[];
}

export const PlayerCountries: React.FC<Props> = ({ countries }) => {
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
