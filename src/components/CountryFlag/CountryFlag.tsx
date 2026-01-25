import { Image } from '@mantine/core';
import type { CountryType } from 'prisma/zod/schemas/models/Country.schema';

export interface Props {
    country: CountryType,
}

export const CountryFlag: React.FC<Props> = ({ country }) => {
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
