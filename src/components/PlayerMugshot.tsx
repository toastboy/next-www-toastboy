'use client';

import { Anchor, Image, Loader } from '@mantine/core';
import { usePlayer } from 'lib/swr';

interface PlayerMugshotProps {
    idOrLogin: string;
}

const PlayerMugshot: React.FC<PlayerMugshotProps> = ({ idOrLogin }) => {
    const { data, error, isLoading } = usePlayer(idOrLogin);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        <Anchor href={`/footy/player/${data.login}`}>
            <Image
                className="w-full"
                width={300}
                height={300}
                src={`/api/footy/player/${data.login}/mugshot`}
                alt={data.name}
                title={data.name}
            />
        </Anchor>
    );
};

export default PlayerMugshot;
