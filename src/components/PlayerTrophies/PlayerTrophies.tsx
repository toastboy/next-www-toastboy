import { Stack } from '@mantine/core';
import { PlayerTrophyTally } from 'components/PlayerTrophyTally/PlayerTrophyTally';
import { TableNameSchema } from 'prisma/generated/schemas';
import { PlayerRecordType } from 'prisma/generated/schemas/models/PlayerRecord.schema';

import { TableName } from '@/generated/prisma/enums';

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
