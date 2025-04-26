import { TableName } from 'lib/types';
import { PlayerRecord } from 'prisma/generated/zod';

export interface Props {
    table: TableName;
    playerRecord: PlayerRecord;
}

const TableScore = ({ table, playerRecord }: Props) => {
    switch (table) {
        case TableName.averages:
            return `${playerRecord.averages?.toFixed(3)}`;
        case TableName.speedy:
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
