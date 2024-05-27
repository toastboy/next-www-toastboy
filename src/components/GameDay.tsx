'use client';

import { Loader, Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink';
import Team from 'components/Team';
import { useGameDay } from 'lib/swr';

interface GameDayProps {
    id: number;
}

const GameDay: React.FC<GameDayProps> = ({ id }) => {
    const { data: gameDay, error, isLoading } = useGameDay(id);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!gameDay) return null;

    if (gameDay.game) {
        return (
            <>
                <h1>Game {gameDay.id}: <GameDayLink id={gameDay.id} /></h1>
                <Text>{gameDay.comment ? `(${gameDay.comment})` : ''}</Text>
                <Team gameDayId={gameDay.id} team={'A'} />
                <p>vs.</p>
                <Team gameDayId={gameDay.id} team={'B'} />
            </>
        );
    }
    else {
        return (
            <>
                <Text>
                    No game {gameDay.comment ? `(${gameDay.comment})` : ''}
                </Text>
            </>
        );
    }
};

export default GameDay;
