import Image from 'next/image';
import Link from 'next/link';

import { Player } from '@prisma/client';
import playerService from "services/Player";

export default function PlayerMugshot({
    player,
}: {
    player: Player,
}) {
    const url = `/api/footy/player/mugshot/${player.login}`;

    return (
        <Link href={`/footy/player/${player.login}`}>
            <Image
                className="w-full"
                width={300}
                height={300}
                src={url}
                priority={true}
                alt={playerService.getName(player) || "Player"}
            />
        </Link>
    );
}
