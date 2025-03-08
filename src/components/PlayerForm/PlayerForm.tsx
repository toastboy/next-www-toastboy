import { ProgressRoot, ProgressSection } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { fetchData } from 'lib/fetch';
import { OutcomeWithGameDay, Player } from 'lib/types';
import { Key } from 'react';

export interface Props {
    player: Player;
    gameDayId: number;
    games: number;
}

const PlayerForm: React.FC<Props> = async ({ player, gameDayId, games }) => {
    const form = await fetchData<OutcomeWithGameDay[]>(`/api/footy/player/${player.id}/form/${gameDayId}/${games}`);

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
