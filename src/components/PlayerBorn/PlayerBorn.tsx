import { Text } from '@mantine/core';
import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';

export interface Props {
    player: PlayerType;
}

const PlayerBorn: React.FC<Props> = ({ player }) => {
    return (
        <Text>
            {player.born == null ? "Unknown" : player.born.toLocaleDateString('sv')}
        </Text>
    );
};

export default PlayerBorn;
