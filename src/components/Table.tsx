'use client';

import { EnumTable } from 'services/PlayerRecord';
import PlayerLink from './PlayerLink';
import TableScore from './TableScore';
import { Loader } from '@mantine/core';
import { useTable } from 'use/table';

export default function Table({ table, year, qualified, take }: {
    table: EnumTable,
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
