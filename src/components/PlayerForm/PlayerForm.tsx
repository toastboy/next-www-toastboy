import { Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { Player } from 'lib/types';
import { Key } from 'react';
import playerService from 'services/Player';

export interface Props {
    player: Player;
    gameDayId: number;
    games: number;
}

const PlayerForm: React.FC<Props> = async ({ player, gameDayId, games }) => {
    const form = await playerService.getForm(player.id, gameDayId, games);

    if (!form) return <></>;

    return (
        <div className="px-6 py-4">
            {form.map((outcome, index: Key) => (
                <Text key={index} component="span">
                    Game <GameDayLink gameDay={outcome.gameDay} />: {outcome.points}
                </Text>
            ))}
        </div>
    );
};

export default PlayerForm;
