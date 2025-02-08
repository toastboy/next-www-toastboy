'use client';

import { Loader, Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { usePlayerForm } from 'lib/swr';
import { Key } from 'react';

interface PlayerFormProps {
    idOrLogin: string;
    games: number;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ idOrLogin, games }) => {
    const { data, error, isLoading } = usePlayerForm(idOrLogin, games);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length === 0) return <div>failed to load</div>;

    return (
        <div className="px-6 py-4">
            {data.map((outcome, index: Key) => (
                <Text key={index} component="span">
                    Game <GameDayLink id={outcome.gameDayId} />: {outcome.points}
                </Text>
            ))}
        </div>
    );
};

export default PlayerForm;
