import { Flex, Stack, Text, Tooltip } from '@mantine/core';
import { IconBeer, IconClock, IconMedal, IconStar, IconTrophy } from '@tabler/icons-react';
import { TableNameSchema, TableNameType } from 'prisma/generated/zod';
import playerRecordService from 'services/PlayerRecord';

interface TableProps {
    playerId: number;
    table: TableNameType;
    year?: number;
}

const PlayerTableTrophies: React.FC<TableProps> = async ({ playerId, table, year }) => {
    const icon = (() => {
        switch (table) {
            case TableNameSchema.enum.points:
                return <IconTrophy size={16} />;
            case TableNameSchema.enum.averages:
                return <IconStar size={16} />;
            case TableNameSchema.enum.stalwart:
                return <IconMedal size={16} />;
            case TableNameSchema.enum.speedy:
                return <IconClock size={16} />;
            case TableNameSchema.enum.pub:
                return <IconBeer size={16} />;
        }
    })();
    let record = await playerRecordService.getWinners(table, year);
    record = record.filter((winner) => winner.playerId === playerId);

    if (!record || record.length === 0) return null;

    if (record.length > 3) {
        const years = record.map((winner) => winner.year).join(', ').replace(/, ([^,]*)$/, ' & $1');
        return (
            <Flex direction="row" gap="sm" align="center">
                <Tooltip label={`${table} ${years}`}>
                    <Flex direction="row" gap="0.1rem" align="center">
                        {icon}
                        <Text> x {record.length}</Text>
                    </Flex>
                </Tooltip>
            </Flex>
        );
    }
    else {
        return (
            <Flex display="block" direction="row" gap="sm">
                {record.map((winner, index) =>
                    <Tooltip key={index} label={`${table} ${winner.year}`}>
                        {icon}
                    </Tooltip>)}
            </Flex>
        );
    }
};

export interface Props {
    playerId: number;
    year: number;
}

const PlayerTrophies: React.FC<Props> = ({ playerId, year }) => {
    return (
        <Stack gap="xs">
            {TableNameSchema.options.map((table) => (
                <PlayerTableTrophies key={table} playerId={playerId} table={table} year={year} />
            ))}
        </Stack>
    );
};

export default PlayerTrophies;
