import { Stack, Title } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

import { MoneyChart } from '@/components/MoneyChart/MoneyChart';
import { YearSelector } from '@/components/YearSelector/YearSelector';
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
    const allYears = await gameDayService.getAllYears();
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
            <YearSelector activeYear={year} validYears={allYears} />
            <Title w="100%" ta="center" order={1}>{getYearName(year)} Books</Title>
            <MoneyChart data={chartData} />
        </Stack>
    );
};

export default BooksPage;
