'use client';

import { Loader } from '@mantine/core';
import { usePlayerLastPlayed } from 'use/player';

export default function PlayerLastPlayed({ idOrLogin }: { idOrLogin: string }) {
    const { playerLastPlayed, playerLastPlayedIsError, playerLastPlayedIsLoading } = usePlayerLastPlayed(idOrLogin);

    if (playerLastPlayedIsError) return <div>failed to load</div>;
    if (playerLastPlayedIsLoading) return <Loader color="gray" type="dots" />;

    return (
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">Last played: {new Date(playerLastPlayed.gameDay.date).toLocaleDateString('sv')}</p>
        </div>
    );
}
