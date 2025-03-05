import { Flex, Stack, Text, Tooltip } from '@mantine/core';
import { IconBeer, IconClock, IconMedal, IconStar, IconTrophy } from '@tabler/icons-react';
import { fetchData } from 'lib/fetch';
import { Player, PlayerRecordWithPlayer, TableName } from 'lib/types';

interface TableProps {
    player: Player;
    table: TableName;
    year?: number;
}

const PlayerTableTrophies: React.FC<TableProps> = async ({ player, table, year }) => {
    let record = await fetchData<PlayerRecordWithPlayer[]>(`/api/footy/winners/${table}/${year || ''}`);
    record = record.filter((winner) => winner.player.id === player.id);

    if (!record || record.length == 0) return null;

    if (record.length > 3) {
        const years = record.map((winner) => winner.year).join(', ').replace(/, ([^,]*)$/, ' & $1');
        return (
            <Flex direction="row" gap="sm" align="center">
                <Tooltip label={`${table} ${years}`}>
                    <Flex direction="row" gap="0.1rem" align="center">
                        {(() => {
                            switch (table) {
                                case 'points':
                                    return <IconTrophy size={16} />;
                                case 'averages':
                                    return <IconStar size={16} />;
                                case 'stalwart':
                                    return <IconMedal size={16} />;
                                case 'speedy':
                                    return <IconClock size={16} />;
                                case 'pub':
                                    return <IconBeer size={16} />;
                            }
                        })()}
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
                        {(() => {
                            switch (table) {
                                case 'points':
                                    return <IconTrophy key={index} size={16} />;
                                case 'averages':
                                    return <IconStar key={index} size={16} />;
                                case 'stalwart':
                                    return <IconMedal key={index} size={16} />;
                                case 'speedy':
                                    return <IconClock key={index} size={16} />;
                                case 'pub':
                                    return <IconBeer key={index} size={16} />;
                            }
                        })()}
                    </Tooltip>)}
            </Flex>
        );
    }
};

export interface Props {
    player: Player;
    year: number;
}

const PlayerTrophies: React.FC<Props> = ({ player, year }) => {
    return (
        <Stack gap="xs">
            {Object.keys(TableName).map((table) => (
                <PlayerTableTrophies key={table} player={player} table={table as TableName} year={year} />
            ))}
        </Stack>
    );
};

export default PlayerTrophies;
