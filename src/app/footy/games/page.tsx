export const dynamic = 'force-dynamic';

import { Flex, Title } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

import { GameDayList } from '@/components/GameDayList/GameDayList';
import { YearSelector } from '@/components/YearSelector/YearSelector';
import gameDayService from '@/services/GameDay';

interface PageProps {
    searchParams?: Promise<{
        year?: string;
    }>;
}

const unpackParams = cache(async (
    searchParams: PageProps['searchParams'],
) => {
    const [resolvedSearchParams, allYears, currentGameDay] = await Promise.all([
        searchParams,
        gameDayService.getAllYears(true),
        gameDayService.getCurrent(),
    ]);
    const yearResult = z.coerce.number().int().min(0).safeParse(resolvedSearchParams?.year ?? 0);
    const year = yearResult.success ? yearResult.data : undefined;
    if (year === undefined || !allYears.includes(year)) notFound();

    const [gamesPlayed, gamesCancelled, gamesRemaining] = await Promise.all([
        gameDayService.getGamesPlayed(year, currentGameDay?.id),
        gameDayService.getGamesCancelled(year, currentGameDay?.id),
        gameDayService.getGamesRemaining(year),
    ]);

    const canonicalSearch = year !== undefined ? `?year=${year}` : '';
    const canonicalUrl = `/footy/games/${canonicalSearch}`;
    const currentSearch = resolvedSearchParams?.year !== undefined ?
        `?year=${resolvedSearchParams.year}` :
        '';
    const currentUrl = `/footy/games/${currentSearch}`;
    if (currentUrl !== canonicalUrl) permanentRedirect(canonicalUrl);

    const title = `${year ? `${year} ` : ''}Games`;
    const subheadValues = [];
    if (gamesPlayed) subheadValues.push(`${gamesPlayed} played`);
    if (gamesCancelled) subheadValues.push(`${gamesCancelled} cancelled`);
    if (gamesRemaining) subheadValues.push(`${gamesRemaining} confirmed`);
    const subhead = subheadValues.join(', ');

    return { year, allYears, currentGameDay, title, subhead };
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { title } = await unpackParams(props.searchParams);

    return {
        title,
    };
}

const GamesPage = async (props: PageProps) => {
    const { year, allYears, title, subhead } = await unpackParams(props.searchParams);
    const gameDays = await gameDayService.getAll({ year });

    return (
        <Flex direction="column" align="center" gap="lg">
            <YearSelector activeYear={year} validYears={allYears} />
            <Title order={1}>{title}</Title>
            <Title order={2}>{subhead}</Title>
            <GameDayList gameDays={gameDays} year={year} />
        </Flex>
    );
};

export default GamesPage;
