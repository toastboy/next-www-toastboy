'use client';

import { Anchor, Loader } from '@mantine/core';
import { usePlayer, usePlayerName } from 'use/player';

export default function PlayerLink({ idOrLogin }: { idOrLogin: string }) {
    const { player, playerIsError, playerIsLoading } = usePlayer(idOrLogin);
    const { playerName, playerNameIsError, playerNameIsLoading } = usePlayerName(idOrLogin);

    if (playerIsError) return <div>failed to load</div>;
    if (playerIsLoading) return <Loader color="gray" type="dots" />;

    if (playerNameIsError) return <div>failed to load</div>;
    if (playerNameIsLoading) return <Loader color="gray" type="dots" />;

    return (
        <Anchor href={`/footy/player/${player.login}`} >
            {playerName}
        </Anchor>
    );
}
