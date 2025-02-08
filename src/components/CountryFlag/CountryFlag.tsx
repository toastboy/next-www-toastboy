import { Image, Loader } from '@mantine/core';
import { useCountry } from 'lib/swr';

interface CountryFlagProps {
    isoCode: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ isoCode }) => {
    const { data, error, isLoading } = useCountry(isoCode);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        <Image
            className="w-full"
            width={150}
            height={150}
            src={`/api/footy/country/${data.isoCode.toLowerCase()}/flag`}
            alt={data.name}
            title={data.name}
        />
    );
};

export default CountryFlag;
