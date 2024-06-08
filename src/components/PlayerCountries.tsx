'use client';

import { usePlayerCountries } from 'lib/swr';
import CountryFlag from 'components/CountryFlag';
import { Loader } from '@mantine/core';

interface PlayerCountriesProps {
    idOrLogin: string;
}

const PlayerCountries: React.FC<PlayerCountriesProps> = ({ idOrLogin }) => {
    const { data, error, isLoading } = usePlayerCountries(idOrLogin);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length === 0) return <div>failed to load</div>;

    return (
        <div className="px-6 py-4">
            {data.map((item: string) => (
                <CountryFlag key={item} isoCode={item} />
            ))}
        </div>
    );
};

export default PlayerCountries;
