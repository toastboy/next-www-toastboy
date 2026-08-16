'use client';

import { Flex } from '@mantine/core';
import type { TableName } from 'prisma/zod/schemas';

import { WinnersTable } from '@/components/WinnersTable/WinnersTable';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    winners: { table: TableName; records: PlayerRecordDataType[] }[];
}

export const WinnersGrid = ({ winners }: Props) => {
    return (
        <Flex
            wrap="wrap"
            gap="md"
            justify="center"
            align="stretch"
            w="100%"
        >
            {winners.map(({ table, records }) => (
                <WinnersTable
                    table={table}
                    records={records}
                    key={table}
                />
            ))}
        </Flex>
    );
};
