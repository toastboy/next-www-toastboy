import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import gameDayService from '@/services/GameDay';

/**
 * Handles the GET request for retrieving the remaining games for a specific year.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the `year`.
 * @returns A promise resolving to the result of the `handleGET` function, which fetches the remaining games for the specified year.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        () => {
            return gameDayService.getGamesRemaining(parseInt(params.year));
        },
        { params },
    );
};
