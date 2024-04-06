import { PlayerRecord } from '@prisma/client';
import { EnumTable } from 'services/PlayerRecord';

export default async function TableScore({ table, playerRecord }: {
    table: EnumTable,
    playerRecord: PlayerRecord,
}) {
    switch (table) {
        case EnumTable.averages:
            return `${playerRecord.averages?.toFixed(3)}`;
        case EnumTable.speedy:
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
