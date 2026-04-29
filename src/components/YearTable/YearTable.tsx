import { Flex, Group, Title } from '@mantine/core';
import type { TableName } from 'prisma/zod/schemas';

import { RecordsTable } from '@/components/RecordsTable/RecordsTable';
import { UnqualifiedTableName } from '@/lib/tables';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    year: number;
    qualified: PlayerRecordDataType[];
    unqualified: PlayerRecordDataType[];
}

export const YearTable = ({ table, year, qualified, unqualified }: Props) => {
    const utn = UnqualifiedTableName(table) ?? null;

    return (
        <Flex direction="column" gap="md">
            <RecordsTable
                table={table}
                year={year}
                records={qualified}
            />
            {utn ?
                <Group>
                    <Title order={1}>{utn}</Title>
                    <RecordsTable
                        table={table}
                        year={year}
                        records={unqualified}
                    />
                </Group> :
                null
            }
        </Flex>
    );
};


