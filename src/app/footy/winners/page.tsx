import { Grid, GridCol, Stack, Title } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { TableName, TableNameSchema } from 'prisma/zod/schemas';
import { cache } from 'react';
import z from 'zod';

import { WinnersTable } from '@/components/WinnersTable/WinnersTable';
import { YearSelector } from '@/components/YearSelector/YearSelector';
import { getYearName } from '@/lib/utils';
import playerRecordService from '@/services/PlayerRecord';
import { PlayerRecordDataType } from '@/types';

interface PageProps {
    searchParams?: Promise<{
        year?: string;
    }>;
}

const unpackParams = cache(async (
    searchParams: PageProps['searchParams'],
) => {
    const resolvedSearchParams = await searchParams;
    const allYears = await playerRecordService.getAllYears();
    const yearResult = z.coerce.number().int().min(0).safeParse(resolvedSearchParams?.year ?? 0);
    const year = yearResult.success ? yearResult.data : undefined;
    if (year === undefined || !allYears.includes(year)) notFound();

    const canonicalSearch = year ? `?year=${year}` : '';
    const canonicalUrl = `/footy/winners${canonicalSearch}`;
    const currentSearch = resolvedSearchParams?.year ? `?year=${resolvedSearchParams.year}` : '';
    const currentUrl = `/footy/winners${currentSearch}`;
    if (currentUrl !== canonicalUrl) permanentRedirect(canonicalUrl);

    return { year, allYears };
});

/**
 * Generates metadata for the table page.
 * @param props - The page properties containing params and searchParams
 * @param props.params - The route parameters
 * @param props.searchParams - The search query parameters
 * @returns A promise that resolves to the page metadata with the qualified
 * table name as title
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { year } = await unpackParams(props.searchParams);

    return {
        title: `${getYearName(year)} Winners`,
    };
}

const WinnersPage = async (props: PageProps) => {
    const { year, allYears } = await unpackParams(props.searchParams);
    const winners = new Map<TableName, PlayerRecordDataType[]>();

    await Promise.all(TableNameSchema.options.map(async (table) => {
        const record = await playerRecordService.getWinners(table, year);
        winners.set(table, record);
    }));

    return (
        <Stack align="stretch" justify="center" gap="md">
            <YearSelector activeYear={year} validYears={allYears} />
            <Title w="100%" ta="center" order={1}>Winners</Title>
            <Grid>
                {
                    Array.from(winners.entries()).map(([table, records]) => {
                        return (
                            <GridCol span={{ base: 12, sm: 8, md: 6, lg: 4, xl: 3 }} key={table}>
                                <WinnersTable table={table} records={records} />
                            </GridCol>
                        );
                    })
                }
            </Grid>
        </Stack>
    );
};

export default WinnersPage;
