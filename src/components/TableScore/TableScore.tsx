import { PlayerRecord, TableNameSchema, TableNameType } from 'prisma/generated/zod';

export interface Props {
    table: TableNameType;
    playerRecord: PlayerRecord;
}

const TableScore = ({ table, playerRecord }: Props) => {
    switch (table) {
        case TableNameSchema.enum.averages:
            return `${playerRecord.averages?.toFixed(3)}`;
        case TableNameSchema.enum.speedy:
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
