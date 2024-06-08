'use client';

import PlayerLink from 'components/PlayerLink';
import TableScore from 'components/TableScore';
import { Loader } from '@mantine/core';
import { FootyTable, useTable } from 'lib/swr';

interface TableQualifiedProps {
    table: FootyTable;
    year: number;
    qualified?: boolean;
    take?: number;
}

const TableQualified: React.FC<TableQualifiedProps> = ({ table, year, qualified, take }) => {
    const { data, error, isLoading } = useTable(table, year, qualified, take);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length === 0) return <div>failed to load</div>;

    return (
        <div className="px-6 py-4">
            {data.map((record, index) => (
                <div key={index}>
                    <PlayerLink idOrLogin={record.playerId.toString()} /> : <TableScore table={table} playerRecord={record} />
                </div>
            ))}
        </div>
    );
};

export default TableQualified;
