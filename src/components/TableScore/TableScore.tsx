'use client';

import { FootyTable } from 'lib/swr';
import { PlayerRecord } from 'lib/types';

export interface Props {
    table: FootyTable;
    playerRecord: PlayerRecord;
}

const TableScore = ({ table, playerRecord }: Props) => {
    switch (table) {
        case FootyTable.averages:
            return `${playerRecord.averages?.toFixed(3)}`;
        case FootyTable.speedy:
            {
                const date = new Date(0);
                if (playerRecord.speedy !== null) {
                    date.setSeconds(playerRecord.speedy);
                }
                return date.toISOString().substring(11, 19);
            }
        default:
            return playerRecord[table];
    }
};

export default TableScore;
