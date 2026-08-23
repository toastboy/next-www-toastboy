import type { TableName } from 'prisma/zod/schemas';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { config } from '@/lib/config';

export function getYearName(year: number): string {
    return year == 0 ? 'All-time' : year.toString();
}

/**
 * The PlayerRecord rank field(s) a TableName is ranked by: [primary,
 * unqualified variant]. `Pick` requires every member to be a real
 * PlayerRecordType key, so a future rename of any of these fields fails this
 * type rather than silently drifting.
 */
type RankField = keyof Pick<
    PlayerRecordType,
    | 'rankPoints'
    | 'rankAverages'
    | 'rankAveragesUnqualified'
    | 'rankStalwart'
    | 'rankSpeedy'
    | 'rankSpeedyUnqualified'
    | 'rankPub'
>;

export const rankMap: Record<TableName, [RankField, RankField | undefined]> = {
    points: ['rankPoints', undefined],
    averages: ['rankAverages', 'rankAveragesUnqualified'],
    stalwart: ['rankStalwart', undefined],
    speedy: ['rankSpeedy', 'rankSpeedyUnqualified'],
    pub: ['rankPub', undefined],
};

/**
 * The PlayerRecord score field a TableName ranks by. `Pick` requires every
 * member to be a real PlayerRecordType key, so a future rename of any of
 * these fields fails this type rather than silently drifting.
 */
type ScoreField = keyof Pick<
    PlayerRecordType,
    | 'scorePoints'
    | 'scoreAverages'
    | 'scoreStalwart'
    | 'scoreSpeedy'
    | 'scorePub'
>;

/** Maps a TableName to the PlayerRecord field it ranks by. */
export const scoreFieldMap: Record<TableName, ScoreField> = {
    points: 'scorePoints',
    averages: 'scoreAverages',
    stalwart: 'scoreStalwart',
    speedy: 'scoreSpeedy',
    pub: 'scorePub',
};

export function ShortTableTitle(table: TableName): string {
    return table.charAt(0).toUpperCase() + table.slice(1);
}

export function TableTitle(table: TableName): string {
    switch (table) {
        case TableNameSchema.enum.speedy:
            return 'Captain Speedy';
        case TableNameSchema.enum.stalwart:
            return 'Stalwart Standings';
        default:
            return table.charAt(0).toUpperCase() + table.slice(1) + ' Table';
    }
}

export function QualifiedTableName(table: TableName, year: number): string {
    return `${getYearName(year)} ${TableTitle(table)}`;
}

export function UnqualifiedTableName(table: TableName): string | undefined {
    switch (table) {
        case TableNameSchema.enum.averages:
            return `Played Fewer than ${config.minGamesForAveragesTable} Games`;
        case TableNameSchema.enum.speedy:
            return `Responded Fewer than ${config.minRepliesForSpeedyTable} Times`;
        default:
            return undefined;
    }
}
