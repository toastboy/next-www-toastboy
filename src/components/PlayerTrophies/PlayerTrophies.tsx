import { Stack } from '@mantine/core';
import { PlayerTrophyTally } from 'components/PlayerTrophyTally/PlayerTrophyTally';

import { TableName } from '@/generated/prisma/enums';
import { TableNameSchema } from '@/generated/zod/schemas';
import { PlayerRecordType } from '@/generated/zod/schemas/models/PlayerRecord.schema';

export interface Props {
    trophies: Map<TableName, PlayerRecordType[]>;
}

export const PlayerTrophies: React.FC<Props> = ({ trophies }) => {
    return (
        <Stack gap="xs">
            {TableNameSchema.options.map((table) => (
                <PlayerTrophyTally
                    key={table}
                    table={table}
                    trophies={trophies.get(table) ?? []}
                />
            ))}
        </Stack>
    );
};
