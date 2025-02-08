'use client';

import { Loader } from '@mantine/core';
import TableQualified from 'components/TableQualified/TableQualified';
import config from 'lib/config';
import { FootyTable, useGameYear } from 'lib/swr';
import { getYearName } from 'lib/utils';

interface TableProps {
    table: FootyTable;
    year: number;
}

const Table: React.FC<TableProps> = ({ table, year }) => {
    const { data, error, isLoading } = useGameYear(year);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || data === null) return <div>failed to load</div>;

    if (UnqualifiedTableName(table)) {
        return (
            <div>
                <p className="text-2xl font-bold">{QualifiedTableName(table, year)}</p>
                <TableQualified table={table} year={year} qualified={true} />
                <p className="text-2xl font-bold">{UnqualifiedTableName(table)}</p>
                <TableQualified table={table} year={year} qualified={false} />
            </div>
        );
    }
    else {
        return (
            <div>
                <p className="text-2xl font-bold">{QualifiedTableName(table, year)}</p>
                <TableQualified table={table} year={year} />
            </div>
        );
    }
};

/**
 * Generates a qualified table name based on the provided table type and year.
 * @param {FootyTable} table - The type of table.
 * @param {number} year - The year for which the table is generated.
 * @returns {string} - The qualified table name.
 */
function QualifiedTableName(table: FootyTable, year: number): string {
    let tableName = "";
    switch (table) {
        case FootyTable.speedy:
            tableName = 'Captain Speedy';
            break;
        case FootyTable.stalwart:
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
 * @param {FootyTable} table - The type of table.
 * @param {number} year - The year for which the table is generated.
 * @returns {string} - The qualified table name or null.
 */
function UnqualifiedTableName(table: FootyTable): string | null {
    switch (table) {
        case FootyTable.averages:
            return `Played Fewer than ${config.minGamesForAveragesTable} Games`;
        case FootyTable.speedy:
            return `Responded Fewer than ${config.minRepliesForSpeedyTable} Times`;
        default:
            return null;
    }
}

export default Table;
