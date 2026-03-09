import { Box } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

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
            component="span"
            ml="xs"
            style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: isPast ? color : 'transparent',
                border: isPast ? 'none' : `2px solid ${color}`,
                verticalAlign: 'middle',
            }}
            data-testid={`gameday-indicator-${gameDay.id}`}
        />
    );
};
