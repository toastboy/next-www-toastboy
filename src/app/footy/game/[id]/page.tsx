export const dynamic = 'force-dynamic';

import { Anchor, Flex } from '@mantine/core';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

import { setGameResult } from '@/actions/setGameResult';
import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
import { GameResultForm } from '@/components/GameResultForm/GameResultForm';
import { getUserRole } from '@/lib/auth.server';
import { getGameWinnersFromTeams } from '@/lib/gameResult';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Unpacks and validates route parameters for the game detail page.
 *
 * Validates the `id` parameter as a positive integer, retrieves the
 * corresponding game day, and handles redirects to the canonical URL if needed.
 *
 * @param params - The route parameters object containing the `id` property
 * @returns A promise that resolves to an object containing the validated
 * `gameDay`
 * @throws Calls `notFound()` if the game day cannot be found or the ID is
 * invalid
 * @throws Calls `permanentRedirect()` if the current URL doesn't match the
 * canonical URL
 */
const unpackParams = cache(async (
    params: PageProps['params'],
) => {
    const { id } = await params;

    const gameDayId = z.coerce.number().int().min(1).safeParse(id);
    const gameDay = gameDayId.success ? await gameDayService.get(gameDayId.data) : undefined;
    if (!gameDay) notFound();

    const canonicalUrl = `/footy/game/${gameDay.id}`;
    const currentUrl = `/footy/game/${id}`;
    if (currentUrl !== canonicalUrl) permanentRedirect(canonicalUrl);

    return { gameDay };
});

/**
 * Generates metadata for a game page.
 * @param props - The page props containing route parameters
 * @param props.params - Route parameters including the game ID
 * @returns A promise that resolves to metadata with the game title and date
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { gameDay } = await unpackParams(props.params);

    return {
        title: `Game ${gameDay.id}: ${gameDay.date.toDateString()}`,
    };
}

/**
 * Displays a football game day page with game details, team information, and
 * navigation.
 *
 * This is an async Server Component that fetches game data, determines user
 * role, and renders game results, player teams, and administrative controls
 * based on permissions.
 *
 * @component
 * @param {PageProps} props - The page component props
 * @param {object} props.params - Route parameters containing the game ID
 * @returns {Promise<React.ReactElement>} A flex container with game navigation,
 * admin controls, and game summary
 *
 * @remarks
 * - Fetches previous and next game days for navigation
 * - Retrieves team rosters (up to 10 players per team) for the current game day
 * - Calculates game winners from team data
 * - Only displays the GameResultForm if the user has an 'admin' role
 * - Navigation links (Previous/Next) are conditionally rendered based on data
 *   availability
 *
 * @requires getUserRole - To determine user permissions
 * @requires unpackParams - To extract gameDay from route params
 * @requires gameDayService.getPrevious - To fetch previous game
 * @requires gameDayService.getNext - To fetch next game
 * @requires outcomeService.getTeamPlayersByGameDay - To fetch team rosters
 * @requires getGameWinnersFromTeams - To calculate match winners
 */
const Page: React.FC<PageProps> = async (props: PageProps) => {
    const { gameDay } = await unpackParams(props.params);
    const [role, prevGameDay, nextGameDay, teamA, teamB] = await Promise.all([
        getUserRole(),
        gameDayService.getPrevious(gameDay.id),
        gameDayService.getNext(gameDay.id),
        outcomeService.getTeamPlayersByGameDay(gameDay.id, 'A', 10),
        outcomeService.getTeamPlayersByGameDay(gameDay.id, 'B', 10),
    ]);
    const winners = getGameWinnersFromTeams(teamA, teamB);

    return (
        <Flex w="100%" direction="column" gap="md">
            {!!prevGameDay && (
                <Anchor
                    href={`/footy/game/${prevGameDay?.id ?? 0}`}
                    ta="left"
                >
                    Previous
                </Anchor>
            )}
            {!!nextGameDay && (
                <Anchor
                    href={`/footy/game/${nextGameDay?.id ?? 0}`}
                    ta="right"
                >
                    Next
                </Anchor>
            )}
            {role === 'admin' && (
                <GameResultForm
                    gameDayId={gameDay.id}
                    bibs={gameDay.bibs ?? null}
                    winners={winners}
                    setGameResult={setGameResult}
                />
            )}
            <GameDaySummary
                gameDay={gameDay}
                teamA={teamA}
                teamB={teamB}
            />
        </Flex>
    );
};

export default Page;
