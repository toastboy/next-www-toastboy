'use client';

import { Loader } from '@mantine/core';
import { usePlayerName, usePlayerRecord } from 'use/player';
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
    const { playerName, playerNameIsError, playerNameIsLoading } = usePlayerName(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!record) {
        return null;
    }

    if (playerNameIsError) return <div>failed to load</div>;
    if (playerNameIsLoading) return <Loader color="gray" type="dots" />;

    return (
        <div className="px-6 py-4">
            <table summary={`${playerName}'s ${getYearName(year)} table positions`}>
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
