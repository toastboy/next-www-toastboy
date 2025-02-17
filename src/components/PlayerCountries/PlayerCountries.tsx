'use client';

import { Loader } from '@mantine/core';
import CountryFlag from 'components/CountryFlag/CountryFlag';
import { usePlayerCountries } from 'lib/swr';

interface Props {
    idOrLogin: string;
}

const PlayerCountries: React.FC<Props> = ({ idOrLogin }) => {
    const { data, error, isLoading } = usePlayerCountries(idOrLogin);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length === 0) return <div>failed to load</div>;

    return (
        // TODO: Change styles to use Mantine components
        <div className="px-6 py-4">
            {data.map((item: string) => (
                <CountryFlag key={item} isoCode={item} />
            ))}
        </div>
    );
};

export default PlayerCountries;
