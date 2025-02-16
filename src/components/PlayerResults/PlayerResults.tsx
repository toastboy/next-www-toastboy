'use client';

import { Loader } from '@mantine/core';
import { usePlayerRecord } from 'lib/swr';
import { getYearName } from 'lib/utils';

interface Props {
    idOrLogin: string;
    year: number;
}

const PlayerResults: React.FC<Props> = ({ idOrLogin, year }) => {
    const { data: record, error, isLoading } = usePlayerRecord(idOrLogin, year);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !record) return <div>failed to load</div>;

    const { player, ...playerRecord } = record;

    return (
        <div className="px-6 py-4">
            <table summary={`${player.name}'s ${getYearName(year)} results record`}>
                <caption>{getYearName(year)} Results</caption>
                <tbody>
                    <tr><th>Played</th><td>{playerRecord.played}</td></tr>
                    <tr><th>Won</th><td>{playerRecord.won}</td></tr>
                    <tr><th>Drawn</th><td>{playerRecord.drawn}</td></tr>
                    <tr><th>Lost</th><td>{playerRecord.lost}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlayerResults;
