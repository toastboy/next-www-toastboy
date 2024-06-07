'use client';

import { Loader } from '@mantine/core';
import { Key } from 'react';
import { usePlayerForm } from 'lib/swr';
import GameDayLink from 'components/GameDayLink';

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
                <p key={index}>Game <GameDayLink id={outcome.gameDayId} />: {outcome.points}</p>
            ))}
        </div>
    );
};

export default PlayerForm;
