'use client';

import { Anchor, Loader } from '@mantine/core';
import { usePlayer } from 'lib/swr';

interface PlayerLinkProps {
    idOrLogin: string;
}

const PlayerLink: React.FC<PlayerLinkProps> = ({ idOrLogin }) => {
    const { data, error, isLoading } = usePlayer(idOrLogin);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        <Anchor href={`/footy/player/${data.login}`} >
            {data.name}
        </Anchor>
    );
};

export default PlayerLink;
