import { ProgressRoot, ProgressSection } from '@mantine/core';
import { Key } from 'react';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { PlayerFormType } from '@/types';

export interface Props {
    form: PlayerFormType[],
}

export const PlayerForm = ({ form }: Props) => {
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
