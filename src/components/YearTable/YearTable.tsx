import { Flex, Group } from '@mantine/core';
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
                key={`${table}-${year}-qualified`}
                table={table}
                year={year}
                records={qualified}
            />
            {utn ?
                <Group mt="xl">
                    <RecordsTable
                        key={`${table}-${year}-unqualified`}
                        table={table}
                        year={year}
                        records={unqualified}
                        title={utn}
                        titleOrder={4}
                    />
                </Group> :
                null
            }
        </Flex>
    );
};


