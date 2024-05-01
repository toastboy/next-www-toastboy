'use client';

import { Loader } from '@mantine/core';
import { usePlayerLastPlayed } from 'lib/swr';
import GameDayLink from 'components/GameDayLink';

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
            <p>Last played: <GameDayLink id={lastplayed.gameDayId} /></p>
        </div>
    );
}
