import { Box, Flex } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayLink } from '../GameDayLink/GameDayLink';

export interface Props {
    gameDay: GameDayType;
}

export const GameDayIndicator = ({ gameDay }: Props) => {
    const isPast = new Date(gameDay.date) < new Date();
    let color = 'var(--mantine-color-green-6)';

    if (gameDay.game === false) {
        if (gameDay.mailSent === null) {
            color = 'var(--mantine-color-dark-6)';
        } else {
            color = 'var(--mantine-color-red-6)';
        }
    }

    return (
        <Flex
            direction='column'
            display='inline-flex'
            bd='2px solid var(--mantine-color-dark-6)'
            bdrs='var(--mantine-radius-md)'
            p={0}
            m={0}
            w='3em'
            style={{
                overflow: 'hidden',
                verticalAlign: 'top',
            }}
        >
            <Box
                component='span'
                display='block'
                w='100%'
                h={12}
                bg={isPast ? color : 'transparent'}
                p={0}
                m={0}
                style={{
                    borderBottom: isPast ? 'none' : `2px solid ${color}`,
                    alignSelf: 'flex-start',
                }}
                data-testid={`gameday-indicator-${gameDay.id}`}
            />
            <GameDayLink gameDay={gameDay} format='numeric' />
        </Flex>
    );
};
