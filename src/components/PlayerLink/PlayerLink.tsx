import { Anchor } from '@mantine/core';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

export interface Props {
    player: PlayerType;
    year: number;
}

export const PlayerLink = ({ player, year }: Props) => {
    return (
        <Anchor href={`/footy/player/${player.id}${year ? `/${year}` : ''}`} >
            {player.name}
        </Anchor>
    );
};
