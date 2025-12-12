import { Anchor, Image } from '@mantine/core';
import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';

export interface Props {
    player: PlayerType,
}

export const PlayerMugshot: React.FC<Props> = ({ player }) => {
    return (
        <Anchor href={`/footy/player/${player.id}`}>
            <Image
                w="100%"
                h="100%"
                src={`/api/footy/player/${player.id}/mugshot`}
                alt={player.name ?? `Player ${player.id}`}
                title={player.name ?? `Player ${player.id}`}
            />
        </Anchor>
    );
};
