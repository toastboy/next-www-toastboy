import { Anchor } from '@mantine/core';
import { Player } from 'lib/types';

export interface Props {
    player: Player;
    year: number;
}

const PlayerLink: React.FC<Props> = async ({ player, year }) => {
    return (
        <Anchor href={`/footy/player/${player.id}${year ? `/${year}` : ''}`} >
            {player.name}
        </Anchor>
    );
};

export default PlayerLink;
