import { ProgressRoot, ProgressSection } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { Key } from 'react';
import { PlayerFormType } from 'types';

export interface Props {
    form: PlayerFormType[],
    games: number,
}

const PlayerForm: React.FC<Props> = ({ form, games }) => {
    const colors = ['red', 'yellow', 'green'];

    return (
        <ProgressRoot size="xl">
            {form.map((data, index: Key) => {
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
