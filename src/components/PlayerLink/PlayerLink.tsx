import { Anchor } from '@mantine/core';
import playerService from 'services/Player';

export interface Props {
    playerId: number;
    year: number;
}

const PlayerLink: React.FC<Props> = async ({ playerId, year }) => {
    const player = await playerService.getById(playerId);

    if (!player) return <></>;

    return (
        <Anchor href={`/footy/player/${player.id}${year ? `/${year}` : ''}`} >
            {player.name}
        </Anchor>
    );
};

export default PlayerLink;
