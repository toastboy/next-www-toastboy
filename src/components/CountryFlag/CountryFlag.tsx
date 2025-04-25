import { Image } from '@mantine/core';
import { Country } from 'prisma/generated/prisma/client';

export interface Props {
    country: Country,
}

const CountryFlag: React.FC<Props> = async ({ country }) => {
    return (
        <Image
            w="100%"
            h="100%"
            src={`/api/footy/country/${country.isoCode.toLowerCase()}/flag`}
            alt={country.name}
            title={country.name}
        />
    );
};

export default CountryFlag;
