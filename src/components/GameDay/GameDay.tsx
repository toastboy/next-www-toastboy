'use client';

import { Loader, Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import Team from 'components/Team/Team';
import { useGameDay } from 'lib/swr';

interface GameDayProps {
    id: number;
}

const GameDay: React.FC<GameDayProps> = ({ id }) => {
    const { data, error, isLoading } = useGameDay(id);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    if (data.game) {
        return (
            <>
                <h1>Game {data.id}: <GameDayLink id={data.id} /></h1>
                <Text>{data.comment ? `(${data.comment})` : ''}</Text>
                <Team gameDayId={data.id} team={'A'} />
                <Text>vs.</Text>
                <Team gameDayId={data.id} team={'B'} />
            </>
        );
    }
    else {
        return (
            <>
                <Text>
                    No game {data.comment ? `(${data.comment})` : ''}
                </Text>
            </>
        );
    }
};

export default GameDay;
