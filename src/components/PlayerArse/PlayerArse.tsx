'use client';

import { Loader } from '@mantine/core';
import { usePlayerArse } from 'lib/swr';

interface PlayerArseProps {
    idOrLogin: string;
}

const PlayerArse: React.FC<PlayerArseProps> = ({ idOrLogin }) => {
    const { data, error, isLoading } = usePlayerArse(idOrLogin);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        // TODO: Change styles to use Mantine components
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">In Goal: {data.in_goal}</p>
            <p className="text-gray-700 text-base">Running: {data.running}</p>
            <p className="text-gray-700 text-base">Shooting: {data.shooting}</p>
            <p className="text-gray-700 text-base">Passing: {data.passing}</p>
            <p className="text-gray-700 text-base">Ball Skill: {data.ball_skill}</p>
            <p className="text-gray-700 text-base">Attacking: {data.attacking}</p>
            <p className="text-gray-700 text-base">Defending: {data.defending}</p>
        </div>
    );
};

export default PlayerArse;
