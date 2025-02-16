'use client';

import { Loader } from '@mantine/core';
import { usePlayerRecord } from 'lib/swr';
import { TableName } from 'lib/types';
import { getYearName, rankMap } from 'lib/utils';

export interface Props {
    idOrLogin: string;
    year: number;
}

const PlayerPositions: React.FC<Props> = ({ idOrLogin, year }) => {
    const { data: record, error, isLoading } = usePlayerRecord(idOrLogin, year);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !record) return <div>failed to load</div>;

    const { player, ...playerRecord } = record;

    return (
        <div className="px-6 py-4">
            <table summary={`${player.name}'s ${getYearName(year)} table positions`}>
                <caption>{getYearName(year)} Positions</caption>
                <tbody>
                    {Object.keys(TableName).map((table) => {
                        const position = playerRecord[rankMap[table as keyof typeof rankMap] as keyof typeof playerRecord];

                        return (
                            <tr key={table}>
                                <th>{table.charAt(0).toUpperCase() + table.slice(1)}</th>
                                <td>{position}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerPositions;
