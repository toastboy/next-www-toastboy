import { Flex, Text, Tooltip } from '@mantine/core';
import { IconBeer, IconClock, IconMedal, IconStar, IconTrophy } from '@tabler/icons-react';
import type { TableName } from 'prisma/zod/schemas';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { config } from '@/lib/config';

export interface Props {
    table: TableName;
    trophies: PlayerRecordType[];
}

export const PlayerTrophyTally = ({ table, trophies }: Props) => {
    const icon = (() => {
        switch (table) {
            case TableNameSchema.enum.points:
                return <IconTrophy role="img" aria-label="trophy" color="white" size={16} />;
            case TableNameSchema.enum.averages:
                return <IconStar role="img" aria-label="star" color="white" size={16} />;
            case TableNameSchema.enum.stalwart:
                return <IconMedal role="img" aria-label="medal" color="white" size={16} />;
            case TableNameSchema.enum.speedy:
                return <IconClock role="img" aria-label="clock" color="white" size={16} />;
            case TableNameSchema.enum.pub:
                return <IconBeer role="img" aria-label="beer" color="white" size={16} />;
        }
    })();

    if (trophies.length > config.trophyDisplayThreshold) {
        const years = trophies.map((winner) => winner.year).join(', ').replace(/, ([^,]*)$/, ' & $1');
        return (
            <Flex direction="row" gap="sm" align="center">
                <Tooltip label={`${table} ${years}`}>
                    <Flex direction="row" gap="0.1rem" align="center">
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
