'use client';

import { FootyTable, FootyPlayerRecord } from 'lib/swr';

interface TableScoreProps {
    table: FootyTable;
    playerRecord: FootyPlayerRecord;
}

const TableScore = ({ table, playerRecord }: TableScoreProps) => {
    switch (table) {
        case FootyTable.averages:
            return `${playerRecord.averages.toFixed(3)}`;
        case FootyTable.speedy:
            {
                const date = new Date(0);
                date.setSeconds(playerRecord.speedy);
                return date.toISOString().substring(11, 19);
            }
        default:
            return playerRecord[table];
    }
};

export default TableScore;
