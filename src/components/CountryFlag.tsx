import { Image, Loader } from '@mantine/core';
import { useCountry } from 'lib/swr';

interface CountryFlagProps {
    isoCode: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ isoCode }) => {
    const { data: country, error, isLoading } = useCountry(isoCode);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!country) return null;

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
