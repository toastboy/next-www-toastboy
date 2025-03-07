import { ProgressRoot, ProgressSection } from '@mantine/core';
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
        <ProgressRoot size="xl">
            {form.map((outcome, index: Key) => (
                <ProgressSection
                    key={index}
                    value={100 / games}
                    color={outcome.points == 3 ? 'green' : outcome.points == 1 ? 'yellow' : 'red'}
                >
                    <GameDayLink gameDay={outcome.gameDay} />
                </ProgressSection>
            ))}
        </ProgressRoot>
    );
};

export default PlayerForm;
