'use client';

import { usePlayerCountries } from 'lib/swr';
import CountryFlag from 'components/CountryFlag';
import { Loader } from '@mantine/core';

interface PlayerCountriesProps {
    idOrLogin: string;
}

const PlayerCountries: React.FC<PlayerCountriesProps> = ({ idOrLogin }) => {
    const { data: countries, error, isLoading } = usePlayerCountries(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!countries || countries.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {countries.map((item: string) => (
                <CountryFlag key={item} isoCode={item} />
            ))}
        </div>
    );
};

export default PlayerCountries;
