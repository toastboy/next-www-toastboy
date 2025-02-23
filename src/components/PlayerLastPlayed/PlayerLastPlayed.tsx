import { Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { Player } from 'lib/types';
import playerService from 'services/Player';

export interface Props {
    player: Player;
}

const PlayerLastPlayed: React.FC<Props> = async ({ player }) => {
    const lastPlayed = await playerService.getLastPlayed(player.id);

    if (!lastPlayed) return <></>;

    return (
        <Text component="span">
            Last played: <GameDayLink gameDay={lastPlayed.gameDay} />
        </Text>
    );
};

export default PlayerLastPlayed;
