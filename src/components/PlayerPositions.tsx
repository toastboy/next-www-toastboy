'use client';

import { Loader } from '@mantine/core';
import { usePlayerRecord } from 'use/player';
import { getYearName } from 'lib/utils';
import { EnumTable } from 'services/PlayerRecord';

export default function PlayerResults({
    idOrLogin,
    year,
}: {
    idOrLogin: string,
    year: number,
}) {
    const { data: record, error, isLoading } = usePlayerRecord(idOrLogin, year);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!record) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            <table summary={`${record.player.name}'s ${getYearName(year)} table positions`}>
                <caption>{getYearName(year)} Positions</caption>
                <tbody>
                    {Object.keys(EnumTable).map((table) => {
                        const position = record[`rank_${table}` as keyof typeof record];
                        if (position === null) {
                            return null;
                        }
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
}
