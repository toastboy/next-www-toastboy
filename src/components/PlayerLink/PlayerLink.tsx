import { Anchor, Tooltip } from '@mantine/core';
import { IconArrowBigLeftLine, IconArrowBigRightLine } from '@tabler/icons-react';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

/**
 * Component for rendering a link to a player's profile with various formatting options.
 *
 * @param player - The player data to link to
 * @param year - The year to include in the link URL (optional)
 * @param format - The format for the link label (default: 'name')
 *   - 'name': Displays the player's name as the link label
 *   - 'left-arrow': Displays a left arrow icon, indicating a link to the previous player
 *   - 'right-arrow': Displays a right arrow icon, indicating a link to the next player
 * @returns A React element representing the formatted player link
 * @example
 * <PlayerLink player={player} year={2024} format="name" />
 * // Renders a link with the player's name as the label, linking to "/footy/player/{player.id}/2024"
 * @example
 * <PlayerLink player={player} format="left-arrow" />
 * // Renders a link with a left arrow icon, linking to "/footy/player/{player.id}"
 * @example
 * <PlayerLink player={player} format="right-arrow" />
 * // Renders a link with a right arrow icon, linking to "/footy/player/{player.id}"
 */
export interface Props {
    player: PlayerType;
    year: number;
    format?: 'name' | 'left-arrow' | 'right-arrow';
}

export const PlayerLink = ({ player, year, format = 'name' }: Props) => {
    let ariaLabel;

    switch (format) {
        case 'name':
            ariaLabel = undefined;
            break;
        case 'left-arrow':
            ariaLabel = `Previous player: ${player.name ?? 'Unknown'}`;
            break;
        case 'right-arrow':
            ariaLabel = `Next player: ${player.name ?? 'Unknown'}`;
            break;
    }

    const link = (
        <Anchor
            href={`/footy/player/${player.id}${year ? `/${year}` : ''}`}
            ta="center"
            fz={{ base: 'xs', md: 'sm', lg: 'lg', xl: 'xl' }}
            aria-label={ariaLabel}
        >
            {(() => {
                switch (format) {
                    case 'name':
                        return player.name;
                    case 'left-arrow':
                        return <IconArrowBigLeftLine aria-hidden />;
                    case 'right-arrow':
                        return <IconArrowBigRightLine aria-hidden />;
                }
            })()}
        </Anchor>
    );

    if (format === 'name') {
        return link;
    }
    else {
        return (
            <Tooltip label={player.name} withArrow>
                {link}
            </Tooltip>
        );
    }
};
