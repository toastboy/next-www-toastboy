'use client';

import { Loader, Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { usePlayerLastPlayed } from 'lib/swr';

interface PlayerLastPlayedProps {
    idOrLogin: string;
}

const PlayerLastPlayed: React.FC<PlayerLastPlayedProps> = ({ idOrLogin }) => {
    const { data, error, isLoading } = usePlayerLastPlayed(idOrLogin);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        <Text component="span">Last played: <GameDayLink id={data.gameDayId} /></Text>
    );
};

export default PlayerLastPlayed;
