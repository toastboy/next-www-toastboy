'use client';

import { usePlayerClubs } from 'lib/swr';
import ClubBadge from 'components/ClubBadge';
import { Loader } from '@mantine/core';

interface PlayerClubsProps {
    idOrLogin: string;
}

const PlayerClubs: React.FC<PlayerClubsProps> = ({ idOrLogin }) => {
    const { data, error, isLoading } = usePlayerClubs(idOrLogin);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length === 0) return <div>failed to load</div>;

    return (
        <div className="px-6 py-4">
            {data.map((item: number) => (
                <ClubBadge key={item} clubId={item} />
            ))}
        </div>
    );
};

export default PlayerClubs;
