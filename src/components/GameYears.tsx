'use client';

import { Loader } from '@mantine/core';
import { Key } from 'react';
import { useGameYears } from 'use/gameday';

export default function GameYears() {
    const { data: distinctYears, error, isLoading } = useGameYears();

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!distinctYears) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {distinctYears.map((year: string, index: Key) => (
                <p key={index} className="text-gray-700 text-base">{year}</p>
            ))}
        </div>
    );
}
