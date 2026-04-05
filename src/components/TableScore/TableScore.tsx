import { Text, Tooltip } from '@mantine/core';
import type { TableName } from 'prisma/zod/schemas';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

export interface Props {
    table: TableName;
    playerRecord: PlayerRecordType;
}

export const TableScore = ({ table, playerRecord }: Props) => {
    switch (table) {
        // ['points', 'averages', 'stalwart', 'speedy', 'pub']

        case TableNameSchema.enum.points:
            return (
                <Tooltip label={`P${playerRecord.played ?? 0} W${playerRecord.won ?? 0} D${playerRecord.drawn ?? 0} L${playerRecord.lost ?? 0}`}>
                    <Text>{playerRecord[table]}</Text>
                </Tooltip>
            );

        case TableNameSchema.enum.averages:
            return (
                <Tooltip label={`P${playerRecord.played ?? 0} W${playerRecord.won ?? 0} D${playerRecord.drawn ?? 0} L${playerRecord.lost ?? 0}`}>
                    <Text>{playerRecord.averages?.toFixed(3) ?? ''}</Text>
                </Tooltip>
            );

        case TableNameSchema.enum.stalwart:
            return (
                <Tooltip label={`Played ${playerRecord.played ?? 0} of ${playerRecord.gamesPlayed ?? 0}`}>
                    <Text>{playerRecord[table]}%</Text>
                </Tooltip>
            );

        case TableNameSchema.enum.speedy:
            {
                const date = new Date(0);
                if (playerRecord.speedy) {
                    date.setSeconds(playerRecord.speedy);
                }
                return (
                    <Tooltip label={`${playerRecord.responses ?? 0} responses`}>
                        <Text>{date.toISOString().substring(11, 19)}</Text>
                    </Tooltip>
                );
            }

        default:
            return <Text>{playerRecord[table]}</Text>;
    }
};
