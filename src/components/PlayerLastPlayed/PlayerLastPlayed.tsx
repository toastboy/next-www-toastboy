import { Text } from '@mantine/core';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { PlayerFormType } from '@/types';

export interface Props {
    lastPlayed: PlayerFormType | null;
}

export const PlayerLastPlayed = ({ lastPlayed }: Props) => {
    if (!lastPlayed) return <Text component="span">Last played: never</Text>;

    return (
        <Text component="span">
            Last played: <GameDayLink gameDay={lastPlayed.gameDay} />
        </Text>
    );
};
