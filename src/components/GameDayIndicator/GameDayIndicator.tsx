import { Box } from '@mantine/core';
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
        <Box
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                border: `2px solid var(--mantine-color-dark-6)`,
                borderRadius: 'var(--mantine-radius-md)',
                padding: 0,
                overflow: 'hidden',
                margin: 0,
                verticalAlign: 'top',
                width: '3em',
            }}
        >
            <Box
                component='span'
                style={{
                    display: 'block',
                    width: '100%',
                    height: '12px',
                    backgroundColor: isPast ? color : 'transparent',
                    borderBottom: isPast ? 'none' : `2px solid ${color}`,
                    padding: 0,
                    margin: 0,
                    alignSelf: 'flex-start',
                }}
                data-testid={`gameday-indicator-${gameDay.id}`}
            />
            <GameDayLink gameDay={gameDay} format='numeric' />
        </Box>
    );
};
