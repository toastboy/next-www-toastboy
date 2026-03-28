import { Anchor, Tooltip } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { formatDate, getOrdinal } from '@/lib/dates';

export interface Props {
    gameDay: GameDayType,
    format?: 'iso' | 'ordinal' | 'numeric';
}

export const GameDayLink = ({ gameDay, format = 'iso' }: Props) => {
    const link = (
        <Anchor href={`/footy/game/${gameDay.id}`} ta='center'>
            {(() => {
                switch (format) {
                    case 'iso':
                        return formatDate(gameDay.date);
                    case 'ordinal':
                        return getOrdinal(gameDay.date.getDate());
                    case 'numeric':
                        return gameDay.date.getDate();
                }
            })()}
        </Anchor>
    );

    if (gameDay.comment) {
        return (
            <Tooltip label={gameDay.comment}>
                {link}
            </Tooltip>
        );
    }

    return link;
};
