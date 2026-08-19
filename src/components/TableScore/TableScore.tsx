'use client';

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
        case TableNameSchema.enum.points:
            return (
                <Tooltip
                    label={`
                    P${playerRecord.played ?? 0}
                    W${playerRecord.won ?? 0}
                    D${playerRecord.drawn ?? 0}
                    L${playerRecord.lost ?? 0}
                `}
                >
                    <Text>{playerRecord.scorePoints ?? '-'}</Text>
                </Tooltip>
            );

        case TableNameSchema.enum.averages:
            return (
                <Tooltip
                    label={`
                    P${playerRecord.played ?? 0}
                    W${playerRecord.won ?? 0}
                    D${playerRecord.drawn ?? 0}
                    L${playerRecord.lost ?? 0}
                `}
                >
                    <Text>{playerRecord.scoreAverages?.toFixed(3) ?? '-'}</Text>
                </Tooltip>
            );

        case TableNameSchema.enum.stalwart:
            return (
                <Tooltip
                    label={`
                    Played ${playerRecord.played ?? 0} of ${playerRecord.gamesPlayed}
                `}
                >
                    <Text>{playerRecord.scoreStalwart ?? '-'}%</Text>
                </Tooltip>
            );

        case TableNameSchema.enum.speedy: {
            let formatted = '-';
            if (playerRecord.scoreSpeedy != null) {
                const date = new Date(0);
                date.setSeconds(Math.round(playerRecord.scoreSpeedy));
                formatted = date.toISOString().substring(11, 19);
            }
            return (
                <Tooltip label={`${playerRecord.responses ?? 0} responses`}>
                    <Text>{formatted}</Text>
                </Tooltip>
            );
        }

        case TableNameSchema.enum.pub:
            return <Text>{playerRecord.scorePub ?? '-'}</Text>;
    }
};
