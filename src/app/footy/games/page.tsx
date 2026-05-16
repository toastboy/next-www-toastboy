export const dynamic = 'force-dynamic';

import { Flex, Group, Title } from '@mantine/core';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { GameDayList } from '@/components/GameDayList/GameDayList';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { getYearName } from '@/lib/tables';
import gameDayService from '@/services/GameDay';
import { FootyChannel } from '@/types/FootyChannel';

interface PageProps {
    searchParams?: Promise<{
        year?: string;
    }>;
}

/**
 * Asynchronously unpacks and validates search parameters for the footy games
 * page, fetching relevant data such as available years, the current game day,
 * and game statistics.
 *
 * - Validates the `year` parameter from the search params, ensuring it is a
 *   valid year present in the list of all years.
 * - If the year is invalid or missing, triggers a 404 not found response.
 * - Fetches the number of games played, cancelled, and remaining for the
 *   specified year.
 * - Ensures the canonical URL structure by redirecting if the current URL does
 *   not match the canonical format.
 * - Constructs a title and subhead string summarizing the games data.
 *
 * @param searchParams - The search parameters from the page props, expected to
 * include a `year` query parameter.
 * @returns An object containing the validated year, all available years, the
 * current game day, a title, and a subhead string.
 * @throws Redirects to the canonical URL if the current URL is not canonical.
 * @throws Triggers a 404 not found response if the year is invalid or not
 * present in the available years.
 */
const unpackParams = cache(async (
    searchParams: PageProps['searchParams'],
) => {
    const [resolvedSearchParams, allYears, currentGameDay] = await Promise.all([
        searchParams,
        gameDayService.getAllYears({
            includeAllTime: true,
            mostRecentFirst: true,
        }),
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
    const { year } = await unpackParams(props.searchParams);
    return { title: `${getYearName(year)} Games` };
}

const GamesPage = async (props: PageProps) => {
    const { year, allYears, subhead } = await unpackParams(props.searchParams);
    const gameDays = await gameDayService.getAll({ year });

    return (
        <Flex direction="column" align="center" gap="lg">
            <AutoRefresh channel={FootyChannel.Games} />
            <AutoRefresh channel={FootyChannel.Results} />
            <Group justify="center" w="100%">
                <TitleWithYearDropdown order={1} title="Games: " year={year} validYears={allYears} />
            </Group>
            <Title order={2}>{subhead}</Title>
            <GameDayList gameDays={gameDays} year={year} />
        </Flex>
    );
};

export default GamesPage;
