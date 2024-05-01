'use client';

import { Anchor, Loader } from '@mantine/core';
import { useGameDay } from 'lib/swr';

export default function GameDayLink({ id }: { id: number }) {
    const { data: gameDay, error, isLoading } = useGameDay(id);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    return (
        <Anchor href={`/footy/game/${gameDay.id}`} >
            {new Date(gameDay.date).toLocaleDateString('sv')}
        </Anchor>
    );
}
