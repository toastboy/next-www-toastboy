import { Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { fetchData } from 'lib/fetch';
import { OutcomeWithGameDay, Player } from 'lib/types';

export interface Props {
    player: Player;
}

const PlayerLastPlayed: React.FC<Props> = async ({ player }) => {
    const lastPlayed = await fetchData<OutcomeWithGameDay>(`/api/footy/player/${player.id}/lastplayed`);

    if (!lastPlayed) return <></>;

    return (
        <Text component="span">
            Last played: <GameDayLink gameDay={lastPlayed.gameDay} />
        </Text>
    );
};

export default PlayerLastPlayed;
