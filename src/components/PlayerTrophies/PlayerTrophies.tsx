import { Stack } from '@mantine/core';
import type { TableName } from 'prisma/generated/browser';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerTrophyTally } from '@/components/PlayerTrophyTally/PlayerTrophyTally';

export interface Props {
    trophies: Map<TableName, PlayerRecordType[]>;
}

export const PlayerTrophies = ({ trophies }: Props) => {
    const totalTrophies = Array.from(trophies.values())
        .reduce((sum, trophyList) => sum + trophyList.length, 0);
    if (totalTrophies === 0) return null;

    return (
        <Stack gap="2cqw" m="1cqw">
            {TableNameSchema.options.map((table) => {
                const trophyList = trophies.get(table);

                if (!trophyList || trophyList.length === 0) return null;

                return (
                    // Icon size is a proportion of the mugshot's own rendered
                    // width (see the `imageContainer` query container in
                    // PlayerCard.module.css), so it grows and shrinks
                    // together with it.
                    <PlayerTrophyTally
                        key={table}
                        table={table}
                        trophies={trophyList}
                        w="5cqw"
                        h="5cqw"
                    />
                );
            })}
        </Stack>
    );
};
