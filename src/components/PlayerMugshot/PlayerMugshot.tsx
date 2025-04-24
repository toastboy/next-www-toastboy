import { Anchor, Image } from '@mantine/core';
import { Player } from 'lib/types';

interface Props {
    player: Player;
}

const PlayerMugshot: React.FC<Props> = ({ player }) => {
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
