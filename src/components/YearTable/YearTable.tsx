import { Flex, Group, Title } from '@mantine/core';
import type { TableName } from 'prisma/zod/schemas';
import { TableNameSchema } from 'prisma/zod/schemas';

import { RecordsTable } from '@/components/RecordsTable/RecordsTable';
import { config } from '@/lib/config';
import { getYearName } from '@/lib/utils';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    year: number;
    qualified: PlayerRecordDataType[];
    unqualified: PlayerRecordDataType[];
}

export const YearTable = ({ table, year, qualified, unqualified }: Props) => {
    const utn = UnqualifiedTableName(table) ?? null;

    return (
        <Flex direction="column" gap="md">
            <RecordsTable
                table={table}
                year={year}
                records={qualified}
            />
            {utn ?
                <Group>
                    <Title order={1}>{utn}</Title>
                    <RecordsTable
                        table={table}
                        year={year}
                        records={unqualified}
                    />
                </Group> :
                null
            }
        </Flex>
    );
};

/**
 * Returns a human-readable title for a given table name.
 *
 * @param table - The table name, as a value of the `TableName` enum.
 * @returns The display title corresponding to the table name.
 *
 * - For `speedy`, returns "Captain Speedy".
 * - For `stalwart`, returns "Stalwart Standings".
 * - For any other value, returns the capitalized table name followed by " Table".
 */
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

/**
 * Generates a qualified table name based on the provided table type and year.
 * @param {TableName} table - The type of table.
 * @param {number} year - The year for which the table is generated.
 * @returns {string} - The qualified table name.
 */
export function QualifiedTableName(table: TableName, year: number): string {
    const tableTitle = TableTitle(table);
    return `${getYearName(year)} ${tableTitle}`;
}

/**
 * Generates a name for an unqualified table based on the provided table type
 * and year: if no qualification is applicable then it returns null.
 * @param {TableName} table - The type of table.
 * @param {number} year - The year for which the table is generated.
 * @returns {string} - The qualified table name or null.
 */
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

