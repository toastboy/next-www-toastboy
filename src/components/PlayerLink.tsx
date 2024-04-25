'use client';

import { Anchor, Loader } from '@mantine/core';
import { usePlayer } from 'use/player';

export default function PlayerLink({ idOrLogin }: { idOrLogin: string }) {
    const { data: player, error, isLoading } = usePlayer(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    return (
        <Anchor href={`/footy/player/${player.login}`} >
            {player.name}
        </Anchor>
    );
}
