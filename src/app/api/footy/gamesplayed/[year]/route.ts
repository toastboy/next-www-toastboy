import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import gameDayService from '@/services/GameDay';

/**
 * Handles the GET request for retrieving games played in a specific year.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters,
 * including the year.
 * @returns A promise resolving to the response of the `handleGET` function,
 * which fetches games played data.
 *
 * @remarks
 * - The `year` parameter is extracted from the route parameters.
 * - An optional query parameter `untilGameDayId` can be provided to filter
 *   games up to a specific game day.
 * - The `gameDayService.getGamesPlayed` function is used to fetch the data.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const searchParams = request.nextUrl.searchParams;
    const untilGameDayId = searchParams.get('untilGameDayId');

    return handleGET(
        () => {
            return gameDayService.getGamesPlayed(parseInt(params.year), untilGameDayId ? parseInt(untilGameDayId) : undefined);
        },
        { params },
    );
};
