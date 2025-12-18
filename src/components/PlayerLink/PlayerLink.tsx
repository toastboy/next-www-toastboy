import { Anchor } from '@mantine/core';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

export interface Props {
    player: PlayerType;
    year: number;
}

export const PlayerLink: React.FC<Props> = ({ player, year }) => {
    return (
        <Anchor href={`/footy/player/${player.id}${year ? `/${year}` : ''}`} >
            {player.name}
        </Anchor>
    );
};
