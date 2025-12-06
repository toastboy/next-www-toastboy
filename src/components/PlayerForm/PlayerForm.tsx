import { ProgressRoot, ProgressSection } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';
import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';
import { Key } from 'react';

export interface Props {
    form: (OutcomeType & { gameDay: GameDayType })[],
    games: number,
}

const PlayerForm: React.FC<Props> = ({ form, games }) => {
    const colors = ['red', 'yellow', 'green'];

    return (
        <ProgressRoot size="xl">
            {form.map(async (data, index: Key) => {
                return <ProgressSection
                    key={index}
                    value={100 / games}
                    color={colors[data.points ?? 0]}
                >
                    <GameDayLink gameDay={data.gameDay} />
                </ProgressSection>;
            })}
        </ProgressRoot>
    );
};

export default PlayerForm;
