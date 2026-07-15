import { Anchor } from '@mantine/core';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder';

export interface Props {
    player: PlayerType,
    radius?: number | string | undefined;
    onReady?: () => void;
}

export const PlayerMugshot = ({ player, radius = undefined, onReady }: Props) => {
    return (
        <Anchor href={`/footy/player/${player.id}`}>
            <ImageWithPlaceholder
                ratio={1}
                radius={radius}
                src={`/api/footy/player/${player.id}/mugshot`}
                alt={player.name ?? `Player ${player.id}`}
                title={player.name ?? `Player ${player.id}`}
                onReady={onReady}
            />
        </Anchor>
    );
};
