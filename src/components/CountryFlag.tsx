import { Image, Loader } from '@mantine/core';
import { useCountry } from 'use/country';

export default function CountryFlag({ isoCode }: { isoCode: string }) {
    const { data: country, error, isLoading } = useCountry(isoCode);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

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
}
