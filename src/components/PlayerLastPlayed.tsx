'use client';

import { Loader } from '@mantine/core';
import { usePlayerLastPlayed } from 'use/player';

export default function PlayerLastPlayed({
    idOrLogin,
}: {
    idOrLogin: string,
}) {
    const { data: lastplayed, error, isLoading } = usePlayerLastPlayed(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    return (
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">Last played: {new Date(lastplayed.gameDay.date).toLocaleDateString('sv')}</p>
        </div>
    );
}
