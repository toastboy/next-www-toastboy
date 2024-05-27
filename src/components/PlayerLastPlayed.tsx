'use client';

import { Loader } from '@mantine/core';
import { usePlayerLastPlayed } from 'lib/swr';
import GameDayLink from 'components/GameDayLink';

interface PlayerLastPlayedProps {
    idOrLogin: string;
}

const PlayerLastPlayed: React.FC<PlayerLastPlayedProps> = ({ idOrLogin }) => {
    const { data: lastplayed, error, isLoading } = usePlayerLastPlayed(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!lastplayed) return null;

    return (
        <div className="px-6 py-4">
            <p>Last played: <GameDayLink id={lastplayed.gameDayId} /></p>
        </div>
    );
};

export default PlayerLastPlayed;
