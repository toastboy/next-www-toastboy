import { Image } from '@mantine/core';
import { Country } from '@prisma/client';

export interface Props {
    country: Country,
}

const CountryFlag: React.FC<Props> = async ({ country }) => {
    return (
        <Image
            className="w-full"
            width={150}
            height={150}
            src={`/api/footy/country/${country.isoCode.toLowerCase()}/flag`}
            alt={country.name}
            title={country.name}
        />
    );
};

export default CountryFlag;
