import { Grid, GridCol, Group, Stack } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { TableName, TableNameSchema } from 'prisma/zod/schemas';
import { cache } from 'react';
import z from 'zod';

import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { WinnersTable } from '@/components/WinnersTable/WinnersTable';
import { getYearName } from '@/lib/tables';
import playerRecordService from '@/services/PlayerRecord';
import { PlayerRecordDataType } from '@/types';

interface PageProps {
    searchParams?: Promise<{
        year?: string;
    }>;
}

/**
 * Resolves and validates the `year` parameter from the given search parameters,
 * ensuring it is a valid integer and exists in the list of all available years.
 * If the year is invalid or not found, triggers a 404 response. If the current
 * URL does not match the canonical URL for the resolved year, performs a
 * permanent redirect to the canonical URL.
 *
 * @param searchParams - The search parameters from the page props, possibly
 * containing a `year` value.
 * @returns An object containing the validated `year` and the list of all
 * available years.
 *
 * @throws Triggers `notFound()` if the year is invalid or not present in the
 * list of years.
 * @throws Triggers `permanentRedirect()` if the current URL does not match the
 * canonical URL.
 */
const unpackParams = cache(async (
    searchParams: PageProps['searchParams'],
) => {
    const resolvedSearchParams = await searchParams;
    const allYears = await playerRecordService.getAllYears({
        completed: true,
        mostRecentFirst: true,
    });
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
            <Group justify="center" w="100%">
                <TitleWithYearDropdown
                    order={1}
                    title="Winners: "
                    year={year}
                    validYears={allYears}
                />
            </Group>
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
