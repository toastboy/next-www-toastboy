'use client';

import PlayerLink from 'components/PlayerLink';
import TableScore from 'components/TableScore';
import { Loader } from '@mantine/core';
import { FootyTable, useTable } from 'lib/swr';

export default function TableQualified({ table, year, qualified, take }: {
    table: FootyTable,
    year: number,
    qualified?: boolean,
    take?: number,
}) {
    const { data, error, isLoading } = useTable(table, year, qualified, take);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!data || data.length == 0) return null;

    return (
        <div className="px-6 py-4">
            {data.map((record, index) => (
                <div key={index}>
                    <PlayerLink idOrLogin={record.playerId.toString()} /> : <TableScore table={table} playerRecord={record} />
                </div>
            ))}
        </div>
    );
}
