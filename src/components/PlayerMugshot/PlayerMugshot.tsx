import { Anchor, Image } from '@mantine/core';
import playerService from 'services/Player';

export interface Props {
    playerId: number;
}

const PlayerMugshot: React.FC<Props> = async ({ playerId }) => {
    const player = await playerService.getById(playerId);

    if (!player) return <></>;

    return (
        <Anchor href={`/footy/player/${player.id}`}>
            <Image
                w="100%"
                h="100%"
                src={`/api/footy/player/${player.id}/mugshot`}
                alt={player.name || `Player ${player.id}`}
                title={player.name || `Player ${player.id}`}
            />
        </Anchor>
    );
};

export default PlayerMugshot;
