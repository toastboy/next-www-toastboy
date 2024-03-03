import Image from 'next/image';

import { Country } from '@prisma/client';

export default function CountryFlag({
    country,
}: {
    country: Country,
}) {
    const flag = country.isoCode.toLowerCase();
    const url = `/api/footy/country/flag/${flag}`;

    return (
        <Image
            className="w-full"
            width={150}
            height={150}
            src={url}
            priority={true}
            alt={country.name}
            title={country.name}
        />
    );
}
