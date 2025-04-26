import { Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import playerService from 'services/Player';

export interface Props {
    playerId: number;
}

const PlayerLastPlayed: React.FC<Props> = async ({ playerId }) => {
    const lastPlayed = await playerService.getLastPlayed(playerId);

    if (!lastPlayed) return <></>;

    return (
        <Text component="span">
            Last played: <GameDayLink gameDayId={lastPlayed.gameDayId} />
        </Text>
    );
};

export default PlayerLastPlayed;
