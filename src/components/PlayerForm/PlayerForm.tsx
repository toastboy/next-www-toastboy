import { ProgressRoot, ProgressSection } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import { Key } from 'react';
import { PlayerFormType } from 'types';

export interface Props {
    form: PlayerFormType[],
}

const PlayerForm: React.FC<Props> = ({ form }) => {
    const colors = new Map<number | null | undefined, string>([
        [null, 'gray'],
        [undefined, 'gray'],
        [0, 'red'],
        [1, 'yellow'],
        [3, 'green'],
    ]);

    return (
        <ProgressRoot size="xl">
            {form.map((data, index: Key) => (
                <ProgressSection
                    key={index}
                    value={100 / form.length}
                    color={colors.get(data.points)}
                >
                    <GameDayLink gameDay={data.gameDay} />
                </ProgressSection>
            ))}
        </ProgressRoot>
    );
};

export default PlayerForm;
