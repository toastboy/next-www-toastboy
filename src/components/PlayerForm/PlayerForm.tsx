import { ProgressRoot, ProgressSection } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { Key } from 'react';
import { PlayerFormType } from 'types';

export interface Props {
    form: PlayerFormType[],
}

const PlayerForm: React.FC<Props> = ({ form }) => {
    const colors = ['red', 'yellow', 'green'];

    return (
        <ProgressRoot size="xl">
            {form.map((data, index: Key) => (
                <ProgressSection
                    key={index}
                    value={100 / form.length}
                    color={data.points == null ? 'gray' : colors[data.points]}
                >
                    <GameDayLink gameDay={data.gameDay} />
                </ProgressSection>
            ))}
        </ProgressRoot>
    );
};

export default PlayerForm;
