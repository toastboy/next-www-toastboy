import { Stack } from '@mantine/core';
import type { TableName } from 'prisma/generated/browser';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerTrophyTally } from '@/components/PlayerTrophyTally/PlayerTrophyTally';

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
