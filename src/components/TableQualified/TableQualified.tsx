'use client';

import { Loader } from '@mantine/core';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import TableScore from 'components/TableScore/TableScore';
import { useTable } from 'lib/swr';
import { TableName } from 'lib/types';

export interface Props {
    table: TableName;
    year: number;
    qualified?: boolean;
    take?: number;
}

const TableQualified: React.FC<Props> = ({ table, year, qualified, take }) => {
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
