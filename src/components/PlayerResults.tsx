'use client';

import { Loader } from '@mantine/core';
import { usePlayerName, usePlayerRecord } from 'use/player';
import { getYearName } from 'lib/utils';

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
            <table summary={`${playerName}'s ${getYearName(year)} results record`}>
                <caption>{getYearName(year)} Results</caption>
                <tbody>
                    <tr><th>Played</th><td>{record.P}</td></tr>
                    <tr><th>Won</th><td>{record.W}</td></tr>
                    <tr><th>Drawn</th><td>{record.D}</td></tr>
                    <tr><th>Lost</th><td>{record.L}</td></tr>
                </tbody>
            </table>
        </div>
    );
}
