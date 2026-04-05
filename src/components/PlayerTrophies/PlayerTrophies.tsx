import { Stack } from '@mantine/core';
import type { TableName } from 'prisma/generated/browser';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerTrophyTally } from '@/components/PlayerTrophyTally/PlayerTrophyTally';

export interface Props {
    trophies: Map<TableName, PlayerRecordType[]>;
}

export const PlayerTrophies = ({ trophies }: Props) => {
    // If the player has no trophies, render nothing
    const totalTrophies = Array.from(trophies.values())
        .reduce((sum, trophyList) => sum + trophyList.length, 0);
    if (totalTrophies === 0) return null;

    return (
        <Stack gap="0.3em" m="xs">
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
