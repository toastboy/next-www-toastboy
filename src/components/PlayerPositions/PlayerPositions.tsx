'use client';

import { Loader } from '@mantine/core';
import { FootyTable, usePlayerRecord } from 'lib/swr';
import { getYearName, rankMap } from 'lib/utils';

export interface Props {
    idOrLogin: string;
    year: number;
}

const PlayerPositions: React.FC<Props> = ({ idOrLogin, year }) => {
    const { data, error, isLoading } = usePlayerRecord(idOrLogin, year);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        <div className="px-6 py-4">
            <table summary={`${data.name}'s ${getYearName(year)} table positions`}>
                <caption>{getYearName(year)} Positions</caption>
                <tbody>
                    {Object.keys(FootyTable).map((table) => {
                        const position = data[rankMap[table as keyof typeof rankMap] as keyof typeof data];

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
