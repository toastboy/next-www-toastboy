import { Flex, Text, Tooltip } from '@mantine/core';
import { IconBeer, IconClock, IconMedal, IconStar, IconTrophy } from '@tabler/icons-react';
import type { TableName } from 'prisma/zod/schemas';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import type { CSSProperties } from 'react';

import { config } from '@/lib/config';

export interface Props {
    table: TableName;
    trophies: PlayerRecordType[];
    /** Sizing is the caller's concern — e.g. `cqw` units only make sense in a
        component that knows about the query container they're relative to. */
    w: CSSProperties['width'];
    h: CSSProperties['height'];
}

export const PlayerTrophyTally = ({ table, trophies, w, h }: Props) => {
    const iconStyle = { width: w, height: h };

    const icon = (() => {
        switch (table) {
            case TableNameSchema.enum.points:
                return <IconTrophy role="img" aria-label="trophy" color="white" style={iconStyle} />;
            case TableNameSchema.enum.averages:
                return <IconStar role="img" aria-label="star" color="white" style={iconStyle} />;
            case TableNameSchema.enum.stalwart:
                return <IconMedal role="img" aria-label="medal" color="white" style={iconStyle} />;
            case TableNameSchema.enum.speedy:
                return <IconClock role="img" aria-label="clock" color="white" style={iconStyle} />;
            case TableNameSchema.enum.pub:
                return <IconBeer role="img" aria-label="beer" color="white" style={iconStyle} />;
        }
    })();

    if (trophies.length > config.trophyDisplayThreshold) {
        const years = trophies.map((winner) => winner.year).join(', ').replace(/, ([^,]*)$/, ' & $1');
        return (
            <Flex direction="row" gap="sm" align="center">
                <Tooltip label={`${table} ${years}`}>
                    <Flex direction="row" gap="1cqw" align="center">
                        {icon}
                        <Text c="white"> x {trophies.length}</Text>
                    </Flex>
                </Tooltip>
            </Flex>
        );
    }

    return (
        <Flex direction="row" gap="0">
            {trophies.map((winner, index) => (
                <Tooltip key={index} label={`${table} ${winner.year}`}>
                    {icon}
                </Tooltip>
            ))}
        </Flex>
    );
};
