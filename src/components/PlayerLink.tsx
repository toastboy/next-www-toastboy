'use client';

import { Anchor, Loader } from '@mantine/core';
import { usePlayer } from 'lib/swr';

interface PlayerLinkProps {
    idOrLogin: string;
}

const PlayerLink: React.FC<PlayerLinkProps> = ({ idOrLogin }) => {
    const { data: player, error, isLoading } = usePlayer(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!player) return null;

    return (
        <Anchor href={`/footy/player/${player.login}`} >
            {player.name}
        </Anchor>
    );
};

export default PlayerLink;
