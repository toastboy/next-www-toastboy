import { Flex } from '@mantine/core';
import TableQualified from 'components/TableQualified/TableQualified';
import config from 'lib/config';
import { getYearName } from 'lib/utils';
import { TableName, TableNameSchema } from 'prisma/generated/schemas';

interface Props {
    table: TableName;
    year: number;
}

const YearTable: React.FC<Props> = ({ table, year }) => {
    const utn = UnqualifiedTableName(table) || null;

    return (
        <Flex direction="column" gap="md">
            <TableQualified table={table} title={QualifiedTableName(table, year)} year={year} qualified={true} />
            {utn ? <TableQualified table={table} title={utn} year={year} qualified={false} /> : null}
        </Flex>
    );
};

/**
 * Generates a qualified table name based on the provided table type and year.
 * @param {TableName} table - The type of table.
 * @param {number} year - The year for which the table is generated.
 * @returns {string} - The qualified table name.
 */
export function QualifiedTableName(table: TableName, year: number): string {
    let tableName = "";
    switch (table) {
        case TableNameSchema.enum.speedy:
            tableName = 'Captain Speedy';
            break;
        case TableNameSchema.enum.stalwart:
            tableName = 'Stalwart Standings';
            break;
        default:
            tableName = table.charAt(0).toUpperCase() + table.slice(1) + ' Table';
    }

    return `${getYearName(year)} ${tableName}`;
}

/**
 * Generates a name for an qualified table name based on the provided table type
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

export default YearTable;
