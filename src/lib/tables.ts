import { TableName, TableNameSchema } from 'prisma/zod/schemas';

import { config } from '@/lib/config';

export function getYearName(year: number): string {
    return year == 0 ? "All-time" : year.toString();
}

export const rankMap: Record<TableName, [string, string | undefined]> = {
    points: ["rankPoints", undefined],
    averages: ["rankAverages", "rankAveragesUnqualified"],
    stalwart: ["rankStalwart", undefined],
    speedy: ["rankSpeedy", "rankSpeedyUnqualified"],
    pub: ["rankPub", undefined],
};

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
