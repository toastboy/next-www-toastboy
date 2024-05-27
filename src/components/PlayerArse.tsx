'use client';

import { Loader } from '@mantine/core';
import { usePlayerArse } from 'lib/swr';

interface PlayerArseProps {
    idOrLogin: string;
}

const PlayerArse: React.FC<PlayerArseProps> = ({ idOrLogin }) => {
    const { data: arse, error, isLoading } = usePlayerArse(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!arse) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">In Goal: {arse.in_goal}</p>
            <p className="text-gray-700 text-base">Running: {arse.running}</p>
            <p className="text-gray-700 text-base">Shooting: {arse.shooting}</p>
            <p className="text-gray-700 text-base">Passing: {arse.passing}</p>
            <p className="text-gray-700 text-base">Ball Skill: {arse.ball_skill}</p>
            <p className="text-gray-700 text-base">Attacking: {arse.attacking}</p>
            <p className="text-gray-700 text-base">Defending: {arse.defending}</p>
        </div>
    );
};

export default PlayerArse;
