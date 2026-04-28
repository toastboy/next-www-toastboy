import { Group, Stack } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

import { MoneyChart } from '@/components/MoneyChart/MoneyChart';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { getYearName } from '@/lib/utils';
import gameDayService from '@/services/GameDay';
import moneyService from '@/services/Money';

interface PageProps {
    searchParams?: Promise<{
        year?: string;
    }>;
}

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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { year } = await unpackParams(props.searchParams);
    return { title: `${getYearName(year)} Books` };
}

const BooksPage = async (props: PageProps) => {
    const { year, allYears } = await unpackParams(props.searchParams);
    const chartData = await moneyService.getChartData(year);

    return (
        <Stack align="stretch" justify="center" gap="md">
            <Group justify="center" w="100%">
                <TitleWithYearDropdown order={1} title="Books: " year={year} validYears={allYears} />
            </Group>
            <MoneyChart data={chartData} />
        </Stack>
    );
};

export default BooksPage;
