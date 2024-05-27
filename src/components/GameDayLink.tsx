'use client';

import { Anchor, Loader } from '@mantine/core';
import { useGameDay } from 'lib/swr';

interface GameDayLinkProps {
    id: number;
}

const GameDayLink: React.FC<GameDayLinkProps> = ({ id }) => {
    const { data: gameDay, error, isLoading } = useGameDay(id);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!gameDay) return null;

    return (
        <Anchor href={`/footy/game/${gameDay.id}`} >
            {new Date(gameDay.date).toLocaleDateString('sv')}
        </Anchor>
    );
};

export default GameDayLink;
