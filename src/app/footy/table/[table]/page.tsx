import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { TableNameSchema } from 'prisma/zod/schemas';
import { cache } from 'react';
import z from 'zod';

import { YearSelector } from '@/components/YearSelector/YearSelector';
import { QualifiedTableName, YearTable } from '@/components/YearTable/YearTable';
import playerRecordService from '@/services/PlayerRecord';

interface PageProps {
    params: Promise<{
        table: string,
    }>,
    searchParams?: Promise<{
        year?: string;
    }>;
}

/**
 * Unpacks and validates page parameters and search parameters for the footy
 * table page.
 *
 * This function validates the table name parameter against the TableNameSchema,
 * validates the year search parameter, and ensures the year exists in the
 * available years. It also handles canonical URL redirects to ensure consistent
 * URL formatting.
 *
 * @param params - The page route parameters containing the table name
 * @param searchParams - The URL search parameters, optionally containing a year
 * @returns A promise resolving to an object containing the validated table
 * name, year, and all available years
 * @throws {notFound} When the table parameter is invalid, year is invalid, or
 * year is not in the available years list
 * @throws {permanentRedirect} When the current URL doesn't match the canonical
 * URL format
 *
 * @example
 * ```tsx
 * const { table, year, allYears } = await unpackParams(params, searchParams);
 * ```
 */
const unpackParams = cache(async (
    params: PageProps['params'],
    searchParams: PageProps['searchParams'],
) => {
    const { table: tableParam } = await params;

    const tableResult = TableNameSchema.safeParse(tableParam);
    if (!tableResult.success) notFound();
    const table = tableResult.data;

    const resolvedSearchParams = await searchParams;
    const allYears = await playerRecordService.getAllYears();
    const yearResult = z.coerce.number().int().min(0).safeParse(resolvedSearchParams?.year ?? 0);
    const year = yearResult.success ? yearResult.data : undefined;
    if (year === undefined || !allYears.includes(year)) notFound();

    const canonicalSearch = year ? `?year=${year}` : '';
    const canonicalUrl = `/footy/table/${table}${canonicalSearch}`;
    const currentSearch = resolvedSearchParams?.year ? `?year=${resolvedSearchParams.year}` : '';
    const currentUrl = `/footy/table/${table}${currentSearch}`;
    if (currentUrl !== canonicalUrl) permanentRedirect(canonicalUrl);

    return { table, year, allYears };
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
    const { table, year } = await unpackParams(props.params, props.searchParams);

    return {
        title: QualifiedTableName(table, year),
    };
}

/**
 * Renders the Footy table page for a specific table and year.
 *
 * This async server component:
 * - Resolves route and query parameters via `unpackParams`.
 * - Fetches both qualified and unqualified player records for the selected
 *   table/year.
 * - Displays a `YearSelector` and a `YearTable` populated with the retrieved
 *   data.
 *
 * @param props - Next.js page props containing dynamic route params and search
 * params.
 * @returns A React element with year selection controls and table results.
 */
const Page: React.FC<PageProps> = async (props) => {
    const { table, year, allYears } = await unpackParams(props.params, props.searchParams);

    const tableQualified = await playerRecordService.getTable(table, year, true);
    const tableUnqualified = await playerRecordService.getTable(table, year, false);

    return (
        <>
            <YearSelector activeYear={year} validYears={allYears} />
            <YearTable
                table={table}
                year={year}
                qualified={tableQualified}
                unqualified={tableUnqualified}
            />
        </>
    );
};

export default Page;
