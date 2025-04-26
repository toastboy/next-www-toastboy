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

    if (!form || form.length === 0) return <></>;

    return (
        <ProgressRoot size="xl">
            {form.map((outcome, index: Key) => (
                <ProgressSection
                    key={index}
                    value={100 / games}
                    color={outcome.points === 3 ? 'green' : outcome.points === 1 ? 'yellow' : 'red'}
                >
                    <GameDayLink gameDayId={outcome.gameDayId} />
                </ProgressSection>
            ))}
        </ProgressRoot>
    );
};

export default PlayerForm;
