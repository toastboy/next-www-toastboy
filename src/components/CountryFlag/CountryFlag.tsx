import { Image } from '@mantine/core';
import type { CountryType } from 'prisma/zod/schemas/models/Country.schema';

export interface Props {
    country: CountryType,
}

export const CountryFlag = ({ country }: Props) => {
    return (
        <Image
            w="100%"
            h="100%"
            src={`/api/footy/country/${country.fifaCode.toLowerCase()}/flag`}
            alt={country.name}
            title={country.name}
        />
    );
};
