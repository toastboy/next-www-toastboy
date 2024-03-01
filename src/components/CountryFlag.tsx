import Image from 'next/image';

import { country } from '@prisma/client';

export default function CountryFlag({
    country,
}: {
    country: country,
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
        />
    );
}
