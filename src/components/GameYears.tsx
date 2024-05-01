'use client';

import { Loader } from '@mantine/core';
import { useGameYears } from 'lib/swr';

export default function GameYears() {
    const { data, error, isLoading } = useGameYears();

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!data) return null;

    return (
        <div className="px-6 py-4">
            {data.map((year, index) => (
                <p key={index} className="text-gray-700 text-base">{year}</p>
            ))}
        </div>
    );
}
