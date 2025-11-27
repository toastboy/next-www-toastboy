import { Text } from '@mantine/core';
import playerService from 'services/Player';

export interface Props {
    playerId: number;
}

const PlayerBorn: React.FC<Props> = async ({ playerId }) => {
    const player = await playerService.getById(playerId);

    if (player?.born == null) return <></>;

    return (
        <Text>
            {player.born == null ? "Unknown" : player.born.toLocaleDateString('sv')}
        </Text>
    );
};

export default PlayerBorn;
