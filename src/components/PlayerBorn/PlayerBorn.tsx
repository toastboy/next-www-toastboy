import { Text } from '@mantine/core';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

export interface Props {
    player: PlayerType;
}

export const PlayerBorn = ({ player }: Props) => {
    return (
        <Text>
            {player.born ?? 'Unknown'}
        </Text>
    );
};
