import { Anchor, Text, Tooltip } from '@mantine/core';
import { IconArrowBigLeftLine, IconArrowBigRightLine } from '@tabler/icons-react';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { formatDate, getOrdinal } from '@/lib/dates';

/**
 * Component for rendering a link to a game day with various formatting options.
 *
 * @param gameDay - The game day data to link to - if null or undefined, the
 * component renders "N/A"
 * @param format - The format for the link label (default: 'iso')
 *   - 'iso': Displays the date in ISO 8601 format (e.g., "2024-06-01")
 *   - 'ordinal': Displays the day of the month with an ordinal suffix (e.g.,
 *     "1st", "2nd")
 *   - 'numeric': Displays only the numeric day of the month (e.g., "1", "2")
 *   - 'left-arrow': Displays a left arrow icon, indicating a link to the
 *     previous game day
 *   - 'right-arrow': Displays a right arrow icon, indicating a link to the next
 *     game day
 * @returns A React element representing the formatted game day link or null if
 * the game day data is not provided
 * @example
 * <GameDayLink gameDay={gameDay} format="ordinal" />
 * // Renders a link with the day of the month in ordinal format (e.g., "1st", "2nd")
 * @example
 * <GameDayLink gameDay={gameDay} format="left-arrow" />
 * // Renders a link with a left arrow icon, indicating a link to the previous game day
 * @example
 * <GameDayLink gameDay={gameDay} format="right-arrow" />
 * // Renders a link with a right arrow icon, indicating a link to the next game day
 */
export interface Props {
    gameDay: GameDayType | null | undefined;
    format?: 'iso' | 'ordinal' | 'numeric' | 'left-arrow' | 'right-arrow';
}

/**
 * Renders a link to a game day with the specified format. The link includes a
 * tooltip that shows the full date and any comment associated with the game
 * day.
 *
 * @param props - The properties for the GameDayLink component
 * @returns A React element representing the game day link
 * @example
 * <GameDayLink gameDay={gameDay} format="ordinal" />
 * // Renders a link with the day of the month in ordinal format (e.g., "1st", "2nd")
 * @example
 * <GameDayLink gameDay={gameDay} format="left-arrow" />
 * // Renders a link with a left arrow icon, indicating a link to the previous game day
 * @example
 * <GameDayLink gameDay={gameDay} format="right-arrow" />
 * // Renders a link with a right arrow icon, indicating a link to the next game day
 */
export const GameDayLink = ({ gameDay, format = 'iso' }: Props) => {
    if (!gameDay) return <Text>N/A</Text>;

    const formattedDate = formatDate(gameDay.date);
    const comment = gameDay.comment ? `(${gameDay.comment})` : '';

    const link = (
        <Anchor
            href={`/footy/game/${gameDay.id}`}
            ta='center'
            aria-label={formattedDate}
        >
            {(() => {
                switch (format) {
                    case 'iso':
                        return formattedDate;
                    case 'ordinal':
                        return getOrdinal(gameDay.date.getDate());
                    case 'numeric':
                        return gameDay.date.getDate();
                    case 'left-arrow':
                        return <IconArrowBigLeftLine />;
                    case 'right-arrow':
                        return <IconArrowBigRightLine />;
                }
            })()}
        </Anchor>
    );

    return (
        <Tooltip label={`${[formattedDate, comment].join(' ').trim()}`}>
            {link}
        </Tooltip>
    );
};
