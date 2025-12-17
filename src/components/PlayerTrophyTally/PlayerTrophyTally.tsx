import { Flex, Text, Tooltip } from '@mantine/core';
import { IconBeer, IconClock, IconMedal, IconStar, IconTrophy } from '@tabler/icons-react';

import { TableName, TableNameSchema } from '@/generated/zod/schemas';
import { PlayerRecordType } from '@/generated/zod/schemas/models/PlayerRecord.schema';

export interface Props {
    table: TableName;
    trophies: PlayerRecordType[];
}

export const PlayerTrophyTally: React.FC<Props> = ({ table, trophies }) => {
    const icon = (() => {
        switch (table) {
            case TableNameSchema.enum.points:
                return <IconTrophy role="img" aria-label="trophy" size={16} />;
            case TableNameSchema.enum.averages:
                return <IconStar role="img" aria-label="star" size={16} />;
            case TableNameSchema.enum.stalwart:
                return <IconMedal role="img" aria-label="medal" size={16} />;
            case TableNameSchema.enum.speedy:
                return <IconClock role="img" aria-label="clock" size={16} />;
            case TableNameSchema.enum.pub:
                return <IconBeer role="img" aria-label="beer" size={16} />;
        }
    })();

    if (trophies.length === 0) return <></>;

    if (trophies.length > 3) {
        const years = trophies.map((winner) => winner.year).join(', ').replace(/, ([^,]*)$/, ' & $1');
        return (
            <Flex direction="row" gap="sm" align="center">
                <Tooltip label={`${table} ${years}`}>
                    <Flex direction="row" gap="0.1rem" align="center">
                        {icon}
                        <Text> x {trophies.length}</Text>
                    </Flex>
                </Tooltip>
            </Flex>
        );
    }

    return (
        <Flex display="block" direction="row" gap="sm">
            {trophies.map((winner, index) =>
                <Tooltip key={index} label={`${table} ${winner.year}`}>
                    {icon}
                </Tooltip>)}
        </Flex>
    );
};
