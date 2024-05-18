'use client';

import { Anchor, Image, Loader } from '@mantine/core';
import { usePlayer } from 'lib/swr';

export default function PlayerMugshot({ idOrLogin }: { idOrLogin: string }) {
    const { data: player, error, isLoading } = usePlayer(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!player) return null;

    return (
        <Anchor href={`/footy/player/${player.login}`}>
            <Image
                className="w-full"
                width={300}
                height={300}
                src={`/api/footy/player/${player.login}/mugshot`}
                alt={player.name}
                title={player.name}
            />
        </Anchor>
    );
}
