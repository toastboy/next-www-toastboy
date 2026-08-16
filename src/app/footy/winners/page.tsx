import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { TableNameSchema } from 'prisma/zod/schemas';
import { cache } from 'react';
import z from 'zod';

import { WinnersGrid } from '@/components/WinnersGrid/WinnersGrid';
import { YearPageShell } from '@/components/YearPageShell/YearPageShell';
import { getYearName } from '@/lib/tables';
import playerRecordService from '@/services/PlayerRecord';
import { FootyChannel } from '@/types/FootyChannel';

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
const unpackParams = cache(async (searchParams: PageProps['searchParams']) => {
    const resolvedSearchParams = await searchParams;
    const allYears = await playerRecordService.getAllYears({
        completed: true,
        mostRecentFirst: true,
    });
    const yearResult = z.coerce
        .number()
        .int()
        .min(0)
        .safeParse(resolvedSearchParams?.year ?? 0);
    const year = yearResult.success ? yearResult.data : undefined;
    if (year === undefined || !allYears.includes(year)) notFound();

    const canonicalSearch = year ? `?year=${year}` : '';
    const canonicalUrl = `/footy/winners${canonicalSearch}`;
    const currentSearch = resolvedSearchParams?.year
        ? `?year=${resolvedSearchParams.year}`
        : '';
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

    const winners = await Promise.all(
        TableNameSchema.options.map(async (table) => {
            const records = await playerRecordService.getWinners(table, year);
            return { table, records };
        }),
    );

    return (
        <YearPageShell
            title="Winners: "
            year={year}
            validYears={allYears}
            autoRefreshChannels={FootyChannel.Results}
            align="stretch"
            justify="center"
            gap="md"
            groupMb="xl"
        >
            <WinnersGrid winners={winners} />
        </YearPageShell>
    );
};

export default WinnersPage;
