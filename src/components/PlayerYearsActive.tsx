'use client';

import { Loader } from '@mantine/core';
import { Key } from 'react';
import { usePlayerYearsActive } from 'use/player';

export default function PlayerYearsActive({
    idOrLogin,
}: {
    idOrLogin: string,
}) {
    const { data: distinctYears, error, isLoading } = usePlayerYearsActive(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!distinctYears) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            <p className="font-bold text-xl mb-2">Years Active</p>
            {distinctYears.map((year: number, index: Key) => (
                <p key={index} className="text-gray-700 text-base">{year}</p>
            ))}
        </div>
    );
}
