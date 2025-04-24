import { handleGET } from 'lib/api';
import { Turnout } from 'lib/types';
import { NextRequest } from 'next/server';
import outcomeService from 'services/Outcome';

/**
 * Handles the GET request for fetching turnout data for a specific game day.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `gameDayId`.
 * @returns A promise resolving to the turnout data for the specified game day.
 *
 * The function retrieves the `gameDayId` from the route parameters, parses it as an integer if defined,
 * and uses it to fetch the turnout data via the `outcomeService.getTurnout` method.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET<Turnout[]>(
        () => outcomeService.getTurnout(
            params.gameDayId != undefined ? parseInt(params.gameDayId) : undefined,
        ),
        { params },
    );
};
