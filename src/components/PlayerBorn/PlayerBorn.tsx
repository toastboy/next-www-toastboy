import { Text } from '@mantine/core';
import { Player } from 'lib/types';

export interface Props {
    player: Player;
}

const PlayerBorn: React.FC<Props> = async ({ player }) => {
    return (
        <Text>
            {player.born == null ? "Unknown" : player.born.toLocaleDateString('sv')}
        </Text>
    );
};

export default PlayerBorn;
