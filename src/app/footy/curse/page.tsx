import { Flex, Group } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

import { CurseOfTheBibs } from '@/components/CurseOfTheBibs/CurseOfTheBibs';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { getYearName } from '@/lib/tables';
import outcomeService from '@/services/Outcome';
import playerRecordService from '@/services/PlayerRecord';

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
        completed: false,
        mostRecentFirst: true,
    });
    const yearResult = z.coerce.number().int().min(0).safeParse(resolvedSearchParams?.year ?? 0);
    const year = yearResult.success ? yearResult.data : undefined;
    if (year === undefined || !allYears.includes(year)) notFound();

    const canonicalSearch = year ? `?year=${year}` : '';
    const canonicalUrl = `/footy/curse${canonicalSearch}`;
    const currentSearch = resolvedSearchParams?.year ? `?year=${resolvedSearchParams.year}` : '';
    const currentUrl = `/footy/curse${currentSearch}`;
    if (currentUrl !== canonicalUrl) permanentRedirect(canonicalUrl);

    return { year, allYears };
});

/**
 * Generates metadata for the table page.
 * @param props - The page properties containing params and searchParams
 * @param props.params - The route parameters
 * @param props.searchParams - The search query parameters
 * @returns A promise that resolves to the page metadata with the chart name as
 * title
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { year } = await unpackParams(props.searchParams);

    return {
        title: `${getYearName(year)} Curse of the Bibs`,
    };
}

const CurseOfTheBibsPage = async (props: PageProps) => {
    const { year, allYears } = await unpackParams(props.searchParams);

    if (!allYears.includes(year)) return notFound();

    const bibsData = await outcomeService.getByBibs({ year });

    return (
        <Flex direction="column" w="100%" align="center">
            <Group justify="center" w="100%">
                <TitleWithYearDropdown
                    order={1}
                    title="Curse of the Bibs: "
                    year={year}
                    validYears={allYears}
                />
            </Group>
            <CurseOfTheBibs bibsData={bibsData} />
        </Flex>
    );
};

export default CurseOfTheBibsPage;
