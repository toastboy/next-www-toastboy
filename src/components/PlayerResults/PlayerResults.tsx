'use client';

import { Loader } from '@mantine/core';
import { usePlayerRecord } from 'lib/swr';
import { getYearName } from 'lib/utils';

interface PlayerResultsProps {
    idOrLogin: string;
    year: number;
}

const PlayerResults: React.FC<PlayerResultsProps> = ({ idOrLogin, year }) => {
    const { data, error, isLoading } = usePlayerRecord(idOrLogin, year);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    return (
        <div className="px-6 py-4">
            <table summary={`${data.name}'s ${getYearName(year)} results record`}>
                <caption>{getYearName(year)} Results</caption>
                <tbody>
                    <tr><th>Played</th><td>{data.P}</td></tr>
                    <tr><th>Won</th><td>{data.W}</td></tr>
                    <tr><th>Drawn</th><td>{data.D}</td></tr>
                    <tr><th>Lost</th><td>{data.L}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlayerResults;
