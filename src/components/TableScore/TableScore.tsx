import type { TableName } from 'prisma/zod/schemas';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

export interface Props {
    table: TableName;
    playerRecord: PlayerRecordType;
}

export const TableScore = ({ table, playerRecord }: Props) => {
    switch (table) {
        case TableNameSchema.enum.averages:
            return playerRecord.averages?.toFixed(3) ?? '';
        case TableNameSchema.enum.speedy:
        {
            const date = new Date(0);
            if (playerRecord.speedy) {
                date.setSeconds(playerRecord.speedy);
            }
            return date.toISOString().substring(11, 19);
        }
        default:
            return playerRecord[table];
    }
};
