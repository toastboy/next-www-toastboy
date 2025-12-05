import gameDayService from '@/services/GameDay';
import { ProgressRoot, ProgressSection } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { Key } from 'react';
import playerService from 'services/Player';

export interface Props {
    playerId: number;
    gameDayId: number;
    games: number;
}

const PlayerForm: React.FC<Props> = async ({ playerId, gameDayId, games }) => {
    const form = await playerService.getForm(playerId, gameDayId, games);
    const colors = ['red', 'yellow', 'green'];

    if (!form || form.length === 0) return <></>;

    return (
        <ProgressRoot size="xl">
            {form.map(async (outcome, index: Key) => {
                const gameDay = await gameDayService.get(outcome.gameDayId);

                if (!gameDay) return <></>;

                return <ProgressSection
                    key={index}
                    value={100 / games}
                    color={colors[outcome.points ?? 0]}
                >
                    <GameDayLink gameDay={gameDay} />
                </ProgressSection>;
            })}
        </ProgressRoot>
    );
};

export default PlayerForm;
