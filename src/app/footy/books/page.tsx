import { Group, Stack } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

import { MoneyChart } from '@/components/MoneyChart/MoneyChart';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { getYearName } from '@/lib/tables';
import gameDayService from '@/services/GameDay';
import moneyService from '@/services/Money';

interface PageProps {
    searchParams?: Promise<{
        year?: string;
    }>;
}

/**
 * Resolves and validates page search parameters for the Books page.
 * @param searchParams - The incoming search params promise from Next.js page
 * props.
 * @throws {notFound} If the year parameter is missing, invalid, or not in the
 * list of valid years.
 * @throws {permanentRedirect} If the current URL does not match the canonical
 * URL for the given year.
 */
const unpackParams = cache(async (
    searchParams: PageProps['searchParams'],
) => {
    const resolvedSearchParams = await searchParams;
    const allYears = await gameDayService.getAllYears({
        includeAllTime: true,
        mostRecentFirst: true,
    });
    const yearResult = z.coerce.number().int().min(0).safeParse(resolvedSearchParams?.year ?? 0);
    const year = yearResult.success ? yearResult.data : undefined;
    if (year === undefined || !allYears.includes(year)) notFound();

    const canonicalSearch = year ? `?year=${year}` : '';
    const canonicalUrl = `/footy/books${canonicalSearch}`;
    const currentSearch = resolvedSearchParams?.year ? `?year=${resolvedSearchParams.year}` : '';
    const currentUrl = `/footy/books${currentSearch}`;
    if (currentUrl !== canonicalUrl) permanentRedirect(canonicalUrl);

    return { year, allYears };
});

/**
 * Generates metadata for the Books page.
 * @param props - The page props containing search parameters.
 * @throws {notFound} If the year parameter is missing, invalid, or not in the
 * list of valid years.
 * @throws {permanentRedirect} If the current URL does not match the canonical
 * URL for the given year.
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { year } = await unpackParams(props.searchParams);
    return { title: `${getYearName(year)} Books` };
}

/**
 * Renders the Books page for the selected year.
 * @param props - The page props containing search parameters.
 * @throws {notFound} If the year parameter is missing, invalid, or not in the
 * list of valid years.
 * @throws {permanentRedirect} If the current URL does not match the canonical
 * URL for the given year.
 */
const BooksPage = async (props: PageProps) => {
    const { year, allYears } = await unpackParams(props.searchParams);
    const chartData = await moneyService.getChartData(year);

    return (
        <Stack w="100%">
            <Group justify="center" w="100%">
                <TitleWithYearDropdown order={1} title="Books: " year={year} validYears={allYears} />
            </Group>
            <MoneyChart data={chartData} linkBase={year === 0 ? '/footy/books?year=' : undefined} />
        </Stack>
    );
};

export default BooksPage;
