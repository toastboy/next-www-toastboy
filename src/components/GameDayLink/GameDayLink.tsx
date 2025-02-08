'use client';

import { Anchor, Loader } from '@mantine/core';
import { useGameDay } from 'lib/swr';

interface GameDayLinkProps {
    id: number;
}

const GameDayLink: React.FC<GameDayLinkProps> = ({ id }) => {
    const { data, error, isLoading } = useGameDay(id);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        <Anchor href={`/footy/game/${data.id}`} >
            {new Date(data.date).toLocaleDateString('sv')}
        </Anchor>
    );
};

export default GameDayLink;
