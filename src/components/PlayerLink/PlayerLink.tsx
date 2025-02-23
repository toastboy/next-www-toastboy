import { Anchor } from '@mantine/core';
import { Player } from 'lib/types';

export interface Props {
    player: Player;
}

const PlayerLink: React.FC<Props> = async ({ player }) => {
    return (
        <Anchor href={`/footy/player/${player.login}`} >
            {player.name}
        </Anchor>
    );
};

export default PlayerLink;
