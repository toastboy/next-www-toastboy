'use client';

import { FootyTable, FootyPlayerRecord } from 'lib/swr';

export default function TableScore({ table, playerRecord }: {
    table: FootyTable,
    playerRecord: FootyPlayerRecord,
}) {
    switch (table) {
        case FootyTable.averages:
            return `${playerRecord.averages?.toFixed(3)}`;
        case FootyTable.speedy:
            if (playerRecord.speedy) {
                const date = new Date(0);
                date.setSeconds(playerRecord.speedy);
                return date.toISOString().substring(11, 19);
            }
            else {
                return null;
            }
        default:
            return playerRecord[table];
    }
}
